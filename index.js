const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const mysql = require('mysql');
const crypto = require('crypto');
const bodyParser = require('body-parser');

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

app.get('/', (req, res) => {
  res.render('login');
})

app.post('/login', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  connection.query("SELECT user_id, user_username, user_password FROM user WHERE user_username = ?", [username], (err, rows) => {
    if (err) { throw err }
    if (rows.length == 0) {
      // No se encontró el usuario
    } else {
      if (rows[0].user_password = password) {
        // iniciar sesion
      } else {
        // Contraseña incorrecta
      }
    }
  })
  
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})

// "INSERT INTO user VALUES (1,'A','2003-05-02','Tomas','Raffo','MED',DEFAULT,DEFAULT,'0','0','tomasraffo',?)"
// cuando llega consulta => busco primer user_username = username => si no hay nada => chau, si hay => nuevoHash con password y comparo nuevoHash == rows[0].user_password