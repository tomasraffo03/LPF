const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const mysql = require('mysql');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const session = require('express-session');

const buttonVolverOrigen = '<a href="/home">Volver</a>';

// const hash = crypto.createHash('sha256').update('tomasraffo').digest('hex');

const connection = mysql.createConnection({
  // host: 'localhost',
  // user: 'root',
  // database: 'LPF'
  
  // host: 'blcxjxn8m2yr46v2yskz-mysql.services.clever-cloud.com',
  // user: 'udgosbqqzaafp0ip',
  // password: 'hBuAkkTyoxyE6F9lzeXk',
  // database: 'blcxjxn8m2yr46v2yskz'
  
  database: 'lpf',
  user: 'ydjsy5l0l2sfvccc7i1b',
  host: 'aws-sa-east-1.connect.psdb.cloud',
  password: 'pscale_pw_Qwfg6U7azMvjfstf1nkaSKlAVUt5QkWRv9kWN6sEJh',
  ssl: {
    rejectUnauthorized: false
  }
})

connection.connect((err) => {
  if (err) throw err;
  console.log('connected to DB');
});

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'static')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'clave',
  resave: true,
  saveUninitialized: true,
}))
app.use(authChecker);

app.get('/', (req, res) => {
  if (req.session.auth) {
    res.redirect('/home')
  } else {
    res.render('login');
  }
})

app.get('/logout', (req, res) => {
  req.session.auth = false;
  req.session.username = '';
  req.session.role = '';
  res.redirect('/')
})

app.get('/home', (req, res) => {
  let user_info;
  let matches_info = [];

  connection.query("SELECT * FROM user WHERE user_username = ?", [req.session.username], (err, rows) => {
    if (err) { throw err }
    connection.query("SELECT match_id, match_date, match_hour, match_status, (SELECT COUNT(team_id) FROM team WHERE team_id = match_team1 OR team_id = match_team2) AS playersCount FROM matchs", (err, rowsMatches) => {
      if (err) throw err;
      if (rowsMatches.length > 0) {
        matches_info = [...rowsMatches];
      }

      user_info = rows[0];
      res.render('home', { user_info: user_info, matches_info: matches_info })
    })

  })
})

app.get('/altausuario', (req, res) => { //only admin
  if (req.session.role == 'A') {
    res.render('altausuario')
  } else {
    res.send(`<p>No tenes permiso para ver esta pagina</p>${buttonVolverOrigen}`)
  }
})

app.get('/crearpartido', (req, res) => { //only admin
  if (req.session.role == 'A') {
    res.render('crearPartido')
  } else {
    res.send(`<p>No tenes permiso para ver esta pagina</p>${buttonVolverOrigen}`)
  }
})

app.get('/configuracion/:username', (req, res) => { //only self or admin
  if (req.session.username == req.params.username || req.session.role == 'A') {
    connection.query("SELECT user_id, user_role, user_dtbirth, user_name, user_surname, user_pos, user_pos2, user_pydmchs, user_wonmatches, user_lostmatches, user_username FROM user WHERE user_username = ?", [req.session.username], (err, data) => {
      if (err) { throw err }
      console.log(data)
      res.render('configuracion', { data: data })
    })
  } else {
    res.send(`<p>No tenes permiso para ver esta pagina</p>${buttonVolverOrigen}`)
  }
})

app.get('/partido/:idPartido', (req, res) => {
  connection.query("SELECT * FROM matchs LEFT JOIN match_det ON matchs.match_id = match_det.match_det_id WHERE match_id = ?", [req.params.idPartido], (err, rowsMatch) => {
    if (err) { throw err }
    if (rowsMatch.length > 0) {
      let team1_id = rowsMatch[0].match_team1;
      let team2_id = rowsMatch[0].match_team2;
      connection.query("SELECT team.team_player, team.team_id, user.user_name, user.user_surname, (SELECT COUNT(team_id) FROM team WHERE team_id = ? OR team_id = ?) AS playersCount FROM team INNER JOIN user ON team.team_player = user.user_id WHERE team.team_id = ? OR team.team_id = ?", [team1_id, team2_id, rowsMatch[0].match_team1, rowsMatch[0].match_team2], (err, rowsTeams) => {
        if (err) { throw err }
        let resArray = [...rowsMatch, ...rowsTeams];
        //[0] -> detalles partido
        //[1...n] -> jugadores
        res.render('partido', { data: resArray, user_role: req.session.role })
        console.log(resArray)
      })
    } else {
      res.send(`<p>Partido no existente</p>${buttonVolverOrigen}`)
    }

  })

})

app.get('/cargarResultado/:idPartido', (req, res) => { //only admin
  if (req.session.role == 'A') {
    connection.query("SELECT * FROM matchs LEFT JOIN match_det ON matchs.match_id = match_det.match_det_id WHERE match_id = ?", [req.params.idPartido], (err, rowsMatch) => {
      if (err) { throw err }
      if (rowsMatch.length > 0) {
        if (rowsMatch[0].match_status != 'confirmado') {
          res.send(`<p>Partido no confirmado o ya Jugado</p>${buttonVolverOrigen}`)
        }
        connection.query("SELECT team.team_player, team.team_id, user.user_name, user.user_surname FROM team INNER JOIN user ON team.team_player = user.user_id WHERE team.team_id = ? OR team.team_id = ?", [rowsMatch[0].match_team1, rowsMatch[0].match_team2], (err, rowsTeams) => {
          if (err) { throw err }
          let resArray = [...rowsMatch, ...rowsTeams];
          //[0] -> detalles partido
          //[1...n] -> jugadores
          res.render('cargarResultado', { data: resArray, user_role: req.session.role })
        })
      } else {
        res.send(`<p>Partido no existente</p>${buttonVolverOrigen}`)
      }

    })
  } else {
    res.send(`<p>No tenes permiso para ver esta pagina</p>${buttonVolverOrigen}`)
  }
})

app.get('/jugador/:idJugador', (req, res) => {
  connection.query("SELECT user_role, user_dtbirth, user_name, user_surname, user_pos, user_pos2, user_pydmchs, user_wonmatches, user_lostmatches, user_username FROM user WHERE user_id = ?", [req.params.idJugador], (err, rowsPlayers) => {
    if (err) { throw err }
    if (rowsPlayers.length > 0) {
      res.render('jugador', { data: rowsPlayers })
    } else {
      res.send(`<p>Jugador inexistente</p>${buttonVolverOrigen}`)
    }
  })
})

app.get('/borrarJugador/:idPartido', (req, res) => {
  connection.query("SELECT match_id, match_status, match_team1, match_team2 FROM matchs WHERE match_id = ?", [req.params.idPartido], (err, rowsMatch) => {
    if (err) { throw err }
    if (rowsMatch.length > 0 && rowsMatch[0].match_status != 'jugado') {
      connection.query("SELECT team_id, user_id, user_name, user_surname FROM team INNER JOIN user ON team_player = user_id WHERE team_id = ? OR team_id = ?", [rowsMatch[0].match_team1, rowsMatch[0].match_team2], (err, rowsTeam) => {
        if (err) { throw err }
        let arrRes = [...rowsMatch, ...rowsTeam];
        console.log(arrRes)
        res.render('borrarJugador', { data: arrRes })
      })
    } else {
      res.send(`<p>Partido inexistente o ya Jugado</p>${buttonVolverOrigen}`)
    }
  })
})


app.post('/login', (req, res) => {
  let username = req.body.username;
  let password = crypto.createHash('sha256').update(req.body.password).digest('hex');

  connection.query("SELECT user_id, user_username, user_password, user_role FROM user WHERE user_username = ?", [username], (err, rows) => {
    if (err) { throw err }

    let role = rows[0].user_role;

    if (rows.length == 0) {
      req.session.auth = false;
      req.session.username = '';
      req.session.role = '';
      res.status(400).send(`<p>Usuario no encontrado</p> ${buttonVolverOrigen}`)
    } else {
      if (rows[0].user_password == password) {
        // iniciar sesion
        req.session.role = role;
        req.session.auth = true;
        req.session.username = username;
        res.redirect('/home')
      } else {
        res.status(400).send(`<p>Contraseña incorrecta</p> ${buttonVolverOrigen}`)
      }
    }
  })
})

app.post('/altausuario', (req, res) => {
  let params = req.body;
  let secPos;

  let pw = crypto.createHash('sha256').update(req.body.password).digest('hex');

  connection.query("INSERT INTO user VALUES (NULL,?,?,?,?,?,?,DEFAULT,DEFAULT,DEFAULT,?,?)", [params.role, params.dtbirth, params.name, params.surname, params.pos, secPos, params.username, pw], (err, rows) => {
    if (err) { throw err }
    console.log('Usuario creado!');
    res.redirect('/altausuario');
  })
})

app.post('/crearpartido', (req, res) => {
  let maxId;

  connection.query("SELECT MAX(match_team2) AS lastId FROM `matchs`", (err, rows) => {
    if (err) { throw err }
    if (rows[0].lastId == null) {
      maxId = 0;
    } else {
      maxId = rows[0].lastId;
    }

    connection.query("INSERT INTO `matchs` VALUES (NULL,?,?,'pendiente',?,?)", [maxId + 1, maxId + 2, req.body.date, req.body.hour], (err, rows) => {
      if (err) { throw err }
      console.log('Partido creado!');
      res.redirect('/crearpartido');
    })
  })
})

app.post('/anotarse', (req, res) => {
  connection.query("SELECT user_id FROM user WHERE user_username = ?", [req.session.username], (err, rowsID) => { //get session username's ID
    if (err) { throw err }
    let usid = rowsID[0].user_id;
    connection.query("SELECT * FROM team WHERE team.team_player = ? AND (team.team_id = ? OR team.team_id = ?)", [usid, req.body.team1, req.body.team2], (err, rows) => { //check if player alredy in match
      if (err) { throw err }
      if (rows.length > 0) { //player alredy in match
        res.send('Ya anotado a este partido')
      } else {
        connection.query("INSERT INTO `team` VALUES (?,?)", [req.body.team1, usid], (err, rows) => {
          if (err) { throw err }
          console.log('Anotado!');

          connection.query("SELECT COUNT(team_id) AS playersCount FROM team WHERE team_id=? OR team_id=?", [req.body.team1, req.body.team2], (err, rowsC) => {
            if (err) { throw err }
            if (rowsC[0].playersCount == 10) {
              connection.query("UPDATE matchs SET match_status='confirmado' WHERE match_id=?", [req.body.match], (err, rows) => {
                if (err) { throw err }
                res.redirect(`/partido/${req.body.match}`);
              })
            } else {
              res.redirect(`/partido/${req.body.match}`);
            }
          })
        })
      }
    })
  })
})

app.post('/editarPartido', (req, res) => {
  let idEq1 = req.body.eq1;
  let idEq2 = req.body.eq2;
  let arr_eq1players = req.body.eq1players.split(",");
  let arr_eq2players = req.body.eq2players.split(",");

  if (arr_eq1players[0] != '') {
    for (let x = 0; x < arr_eq1players.length; x++) { //primero setea en equipo 1
      connection.query("UPDATE team SET team_id = ? WHERE team_player = ? AND (team_id = ? OR team_id = ?)", [idEq1, parseInt(arr_eq1players[x]), idEq1, idEq2], (err, rows) => {
        if (err) { throw err }
      })
    }
  }

  if (arr_eq2players[0] != '') {
    for (let y = 0; y < arr_eq2players.length; y++) { //despues el equipo 2
      connection.query("UPDATE team SET team_id = ? WHERE team_player = ? AND (team_id = ? OR team_id = ?)", [idEq2, parseInt(arr_eq2players[y]), idEq1, idEq2], (err, rows) => {
        if (err) { throw err }
      })
    }
  }

  res.redirect(`/partido/${req.body.match_id}`)

})

app.post('/cargarResultado', (req, res) => {
  console.log(req.body)
  if (req.body.goles_eq1 == '' || req.body.goles_eq2 == '') {
    res.send(`<p>Tenés que cargar los goles ${buttonVolverOrigen}`)
  } else {
    let winnerTeam;
    let loserTeam;

    req.body.goles_eq1 > req.body.goles_eq2 ? (winnerTeam = req.body.team1, loserTeam = req.body.team2) : (winnerTeam = req.body.team2, loserTeam = req.body.team1)

    //crear match_det -> req.body match_id goles_eq1 goles_eq2
    connection.query("INSERT INTO match_det VALUES (?,?,?)", [req.body.match_id, req.body.goles_eq1, req.body.goles_eq2], (err, rows) => {
      if (err) { throw err }
    })

    //update match_status = 'jugado'
    connection.query("UPDATE matchs SET match_status = 'jugado' WHERE match_id = ?", [req.body.match_id], (err, rows) => {
      if (err) { throw err }
    })

    //para cada jugador en team where team_id = winnerTeam => user_pydmchs += 1, user_wonmatches += 1
    connection.query("UPDATE user INNER JOIN team ON user.user_id = team.team_player SET user_pydmchs = user_pydmchs + 1, user_wonmatches = user_wonmatches + 1 WHERE team.team_id = ?", [winnerTeam], (err, rows) => {
      if (err) { throw err }
    })

    //para cada jugador en team where team_id = loserTeam => user_pydmchs += 1, user_lostmatches += 1
    connection.query("UPDATE user INNER JOIN team ON user.user_id = team.team_player SET user_pydmchs = user_pydmchs + 1, user_lostmatches = user_lostmatches + 1 WHERE team.team_id = ?", [loserTeam], (err, rows) => {
      if (err) { throw err }
      res.redirect('/')
    })
  }
})

app.post('/borrarPartido', (req, res) => {
  connection.query("SELECT match_status FROM matchs WHERE match_id = ?", [req.body.match_id], (err, rows) => {
    if (err) { throw err }
    if (rows.length > 0 && rows[0].match_status != 'pendiente') {
      res.send('partido ya confirmado/jugado')
    } else {
      connection.query("DELETE FROM matchs WHERE match_id = ?", [req.body.match_id], (err, rows) => {
        if (err) { throw err }
      })
      connection.query("DELETE FROM team WHERE team_id = ? OR team_id = ?", [req.body.eq1, req.body.eq2], (err, rows) => {
        if (err) { throw err }
        res.redirect('/home')
      })
    }
  })
})

app.post('/configuracion', (req, res) => {
  let pw = crypto.createHash('sha256').update(req.body.password).digest('hex');
  if (req.body.pos2 == '') { pos2 = null } else { pos2 = req.body.pos2.toUpperCase }
  console.log(req.body)
  connection.query("UPDATE user SET user_pos=?, user_pos2=?, user_password=? WHERE user_id=?", [req.body.pos1.toUpperCase(), pos2, pw, req.body.id], (err, rows) => {
    if (err) throw err;
    res.redirect(`/configuracion/${req.body.username}`)
  })
})

app.post('/borrarJugador', (req, res) => {
  //si count < 10 => set match_status = 'pendiente' where match_id = req.body.match_id
  connection.query("SELECT COUNT(team_id) AS playersCount FROM team WHERE team_id=? OR team_id=?", [req.body.team1, req.body.team2], (err, rowsTeam) => {
    if (err) throw err;
    if (rowsTeam[0].playersCount < 10) {
      connection.query("UPDATE matchs SET match_status = 'pendiente' WHERE match_id = ?", [req.body.match_id], (err, rows) => { })
    }
  })

  connection.query("DELETE FROM team WHERE team_player = ? AND (team_id = ? OR team_id = ?)", [req.body.idJugador, req.body.team1, req.body.team2], (err, result) => {
    if (err) throw err;
    console.log(`Jug. ${req.body.idJugador} Borrado de ${req.body.match_id}`)
    res.redirect(`/borrarJugador/${req.body.match_id}`)
  })

})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})

function authChecker(req, res, next) {
  if ((req.session.auth || req.path == '/' || req.path == '/login')) {
    next();
  } else {
    res.redirect('/');
  }
}

asyncQuery = (query, params) => {
  return new Promise((resolve, reject) => {
    connection.query(query, params, (error, rows) => {
      if (error) {
        return reject(error);
      }
      return resolve(elements);
    });
  });
};

// "INSERT INTO user VALUES (1,'A','2003-05-02','Tomas','Raffo','MED',DEFAULT,DEFAULT,'0','0','tomasraffo',?)"
// cuando llega consulta => busco primer user_username = username => si no hay nada => chau, si hay => nuevoHash con password y comparo nuevoHash == rows[0].user_password

