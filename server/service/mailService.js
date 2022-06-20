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
            tls: {
                rejectUnauthorized: false
            }
        })
    }

    sendMail(name, time, email, size, masterName, cityName, orderNumber, next) {
        this.transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: `Подтверждение заказа №${orderNumber}`,
            text: 'Письмо о успешно выполненной брони',
            html:
                `<div>
                <p>${name}, заказ №${orderNumber} успешно оформлен</p>
                <p>Дата выполнения заказа: ${time}</p>
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

    userInfo(email, password, next) {
        this.transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: `Данные для входа`,
            text: 'Ваши данные для входа',
            html:
                `<div>
                <p>Email: ${email}</p>
                <p>Password: ${password}</p>
                <p>Теперь можете выполнить  <a href="${process.env.LOGIN_URL}">АВТОРИЗАЦИЮ</a></p>
                </div>`
        }, err => {
            if (err) {
                return next(ApiError.badRequest(err.message))
            }
        })
    }

    sendActivationMail(email, activationLink, next) {
        this.transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: 'Активация аккаунта',
            text: "",
            html:
                `<div>
             <h1>Для активации аккаунта перейдите по ссылке</h1>
             <a href="${activationLink}">${activationLink}</a>
</div>`,
        }, err => {
            if (err) {
                return next(ApiError.badRequest(err.message))
            }

        })

    }

    updateMail(email, password, next) {
        this.transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: 'Активация аккаунта на',
            text: "",
            html:
                `<div>
                Данные для входа измененны:
                email: ${email}
                 <p>  ${password ? `Ваш пароль: ${password}` : ""}</p>
</div>`,
        }, err => {
            if (err) {
                return next(ApiError.badRequest(err.message))
            }

        })
    }
}

module.exports = new MailService();