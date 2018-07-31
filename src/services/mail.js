const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'clydejhon2@gmail.com',
        pass: 'geiler2018'
    },
    tls: {
        rejectUnauthorized: false
    }
})

module.exports = transporter
