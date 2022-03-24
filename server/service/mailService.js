const nodemailer = require('nodemailer')

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

    async sendMail(name, date, time, email, size, masterName, cityName) {
        await this.transporter.sendMail({
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
        })
    }
}

module.exports = new MailService();