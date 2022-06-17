"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const ApiError_1 = __importDefault(require("../error/ApiError"));
exports.default = new class MailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
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
        });
    }
    sendMail(name, time, email, size, masterName, cityName, password, next) {
        this.transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: 'Подтверждение заказа',
            text: 'Письмо о успешно выполненной брони',
            html: `<div>
                <p>${name}, заказ успешно оформлен</p>
                <p>Дата выполнения заказа: ${time}</p>
                <p>Размер часов: ${size}</p>
                <p>Мастер:${masterName} в городе ${cityName}</p>
                <p>Хорошего, дня!</p>
              <p>  ${password ? `Ваш пароль: ${password}` : ""}</p>
</div>`,
        }, err => {
            if (err) {
                return next(ApiError_1.default.badRequest(err.message));
            }
        });
    }
    sendActivationMail(email, activationLink, next) {
        this.transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: 'Активация аккаунта ',
            text: "",
            html: `<div>
             <h1>Для активации перейдите по ссылке</h1>
             <a href="${activationLink}">${activationLink}</a>
</div>`,
        }, err => {
            if (err) {
                return next(ApiError_1.default.badRequest(err.message));
            }
        });
    }
    updateMail(email, password, next) {
        this.transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: 'Активация аккаунта на',
            text: "",
            html: `<div>
                Данные для входа измененны:
                email: ${email}
                 <p>  ${password ? `Ваш пароль: ${password}` : ""}</p>
</div>`,
        }, err => {
            if (err) {
                return next(ApiError_1.default.badRequest(err.message));
            }
        });
    }
};
