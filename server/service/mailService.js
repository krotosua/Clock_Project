const nodemailer = require('nodemailer')
const ApiError = require("../error/ApiError");

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASSWORD,
            },
        })

    }

    sendMail(name, date, time, email, size, masterName, cityName, next) {

        this.transporter.sendMail({
            from:  process.env.MAIL_USER,
            to: email,
            subject: 'Подтверждение заказа',
            text: 'Письмо о успешно выполненной брони',
            html:
                `<div>
                <p>${name}, заказ успешно оформлен</p>
                <p>Дата выполнения заказа: ${date} в ${time}</p>
                <p>Размер часов: ${size}</p>
                <p>Мастер:${masterName} в городе ${cityName}</p>
                <p>Хорошего, дня!</p>
</div>`,
        }, err => {
            if (err) {
                return next(ApiError.badRequest(err.message))
            }

        })

    }
    sendActivationMail(  email,activationLink,next) {

        this.transporter.sendMail({
            from:  process.env.MAIL_USER,
            to: email,
            subject: 'Активация аккаунта на',
            text: "",
            html:
                `<div>
             <h1>Для активации перейдите по ссылке</h1>
             <a href="${activationLink}">${activationLink}</a>
</div>`,
        }, err => {
            if (err) {
                return next(ApiError.badRequest(err.message))
            }

        })

    }
}

module.exports = new MailService();