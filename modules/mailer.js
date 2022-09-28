const dotenv = require('dotenv').config();

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: true, 
    auth: {
        user: 'lpfmysql@gmail.com', 
        pass: process.env.TRANSPORTER_PASSWORD,
    },
});

transporter.verify().then(() => {
    console.log('ready to send emails')
})

module.exports = { transporter };
