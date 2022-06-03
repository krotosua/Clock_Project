const nodemailer = require('nodemailer')
const ApiError = require("../error/ApiError");

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: 'clockbotproject@gmail.com',
                pass: 'passwordsecret',
            },
        })
    }

    sendMail(name, date, time, email, size, masterName, cityName, next) {

        this.transporter.sendMail({
            from: `clockbotproject@gmail.com`,
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
            from: `clockbotproject@gmail.com`,
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