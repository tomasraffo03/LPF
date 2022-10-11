const dotenv = require('dotenv').config();

const nodemailer = require('nodemailer');
let errorNodemailer;

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: 'lpfmysql@gmail.com',
        pass: process.env.TRANSPORTER_PASSWORD,
    },
});

transporter.verify().then(() => {
    errorNodemailer = false;
    console.log('ready to send emails')
    module.exports = { transporter, errorNodemailer };
}).catch(() => {
    errorNodemailer = true;
    module.exports = { transporter, errorNodemailer };
})


