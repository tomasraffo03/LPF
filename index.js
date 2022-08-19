const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const mysql = require('mysql');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const session = require('express-session');

const buttonVolverOrigen = '<a href="http://localhost:3000">Volver</a>';

// const hash = crypto.createHash('sha256').update('tomasraffo').digest('hex');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'LPF'
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

// req.session.usuario = //nombre de usuario con el que ingresó
// req.session.active = false;

app.get('/', (req, res) => {
  if (req.session.auth) {
    res.render('home')
  } else {
    res.render('login');
  }

})

app.get('/home', (req, res) => {
  let user_info;
  let matches_info = [];

  connection.query("SELECT * FROM user WHERE user_username = ?", [req.session.username], (err, rows) => {
    if (err) { throw err }
    connection.query("SELECT * FROM `match` WHERE match_status = ?", ['pendiente'], (err, rowsMatches) => {
      if (err) throw err;
      if (rowsMatches.length > 0) {
        matches_info = rowsMatches;
      }
    })

    user_info = rows[0];
    res.render('home', { user_info: user_info, matches_info: matches_info})
  })
})

app.get('/altausuario', (req, res) => {
  // despues crear middleware para chequear que sea admin
  // otra func -> ponerlo entre params app.get
  res.render('altaUsuario')
})

app.post('/login', (req, res) => {
  let username = req.body.username;
  let password = crypto.createHash('sha256').update(req.body.password).digest('hex');

  connection.query("SELECT user_id, user_username, user_password FROM user WHERE user_username = ?", [username], (err, rows) => {
    if (err) { throw err }
    if (rows.length == 0) {
      req.session.auth = false;
      req.session.username = '';
      res.status(400).send(`<p>Usuario no encontrado</p> ${buttonVolverOrigen}`)
    } else {
      if (rows[0].user_password == password) {
        // iniciar sesion
        req.session.auth = true;
        req.session.username = username;
        res.redirect('/home')
      } else {
        res.status(400).send(`<p>Contraseña incorrecta</p> ${buttonVolverOrigen}`)
      }
    }
  })

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})

function authChecker(req, res, next) {
  if (req.session.auth || req.path == '/' || req.path == '/login') {
    next();
  } else {
    res.redirect('/');
  }
}

// "INSERT INTO user VALUES (1,'A','2003-05-02','Tomas','Raffo','MED',DEFAULT,DEFAULT,'0','0','tomasraffo',?)"
// cuando llega consulta => busco primer user_username = username => si no hay nada => chau, si hay => nuevoHash con password y comparo nuevoHash == rows[0].user_password

