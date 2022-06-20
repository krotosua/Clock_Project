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

    sendMail(mailInfo, next) {
        this.transporter.sendMail({
            from: process.env.MAIL_USER,
            to: mailInfo.email,
            subject: `Подтверждение заказа №${mailInfo.orderNumber}`,
            text: 'Письмо о успешно выполненной брони',
            html:
                `<div>
                <p>${mailInfo.name}, заказ №${mailInfo.orderNumber} успешно оформлен</p>
                <p>Дата выполнения заказа: ${mailInfo.time}</p>
                <p>Размер часов: ${mailInfo.size}</p>
                <p>Мастер:${mailInfo.masterName} в городе ${mailInfo.cityName}</p>
                <p>Хорошего, дня!</p>
</div>`,
        }, err => {
            if (err) {
                return next(ApiError.badRequest(err.message))
            }

        })

    }

    userInfo(mailInfo, next) {
        this.transporter.sendMail({
            from: process.env.MAIL_USER,
            to: mailInfo.email,
            subject: `Данные для входа`,
            text: 'Ваши данные для входа',
            html:
                `<div>
                <p>Email: ${mailInfo.email}</p>
                <p>Password: ${mailInfo.password}</p>
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