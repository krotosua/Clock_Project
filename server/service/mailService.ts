import nodemailer from 'nodemailer'
import Mail from "nodemailer/lib/mailer"
import ApiError from "../error/ApiError";
import {NextFunction} from "express";

export default new class MailService {
    private readonly transporter: Mail

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
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

    sendMail(name: string, time: string, email: string, size: string, masterName: string, cityName: string, password: string, next: NextFunction) {

        this.transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: 'Подтверждение заказа',
            text: 'Письмо о успешно выполненной брони',
            html:
                `<div>
                <p>${name}, заказ успешно оформлен</p>
                <p>Дата выполнения заказа: ${time}</p>
                <p>Размер часов: ${size}</p>
                <p>Мастер:${masterName} в городе ${cityName}</p>
                <p>Хорошего, дня!</p>
              <p>  ${password ? `Ваш пароль: ${password}` : ""}</p>
</div>`,
        }, err => {
            if (err) {
                return next(ApiError.badRequest(err.message))
            }

        })

    }

    sendActivationMail(email: string, activationLink: string, next: NextFunction) {

        this.transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: 'Активация аккаунта ',
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

    updateMail(email: string, password: string|undefined, next: NextFunction) {
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

