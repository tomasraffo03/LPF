const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'lpfmysql@gmail.com', // generated ethereal user
        pass: 'uwrzcehgakqlvdyp', // generated ethereal password
    },
});

transporter.verify().then(() => {
    console.log('ready to send emails')
})

module.exports = { transporter };