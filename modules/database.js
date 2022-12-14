const dotenv = require('dotenv').config();
const mysql = require('mysql');

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
    password: process.env.DATABASE_PASSWORD,
    ssl: {
        rejectUnauthorized: false
    }
})

connection.connect((err) => {
    if (err) throw err;
    console.log('connected to DB');
});

module.exports = { connection };