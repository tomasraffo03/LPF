const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'LPF'
})

connection.connect((err) => {
    if (err) throw err;
    console.log('connected to DB');
});

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.render('login')
  connection.query('SELECT * FROM config', (err, res) => {
    if (err) throw err;
    console.log(res);
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})