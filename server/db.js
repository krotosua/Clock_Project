const cls = require('cls-hooked')
const namespace = cls.createNamespace('my-namespace')
const {Sequelize} = require('sequelize')
Sequelize.useCLS(namespace)

module.exports= new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        dialect:'postgres',
        host: process.env.DB_HOST,
        port:process.env.DB_PORT
    }
)
// const sequelize =
//     new Sequelize(process.env.DATABASE,
//         {
//             dialect: 'postgres',
//             protocol: 'postgres',
//             dialectOptions: {
//                 ssl: {
//                     require: true,
//                     rejectUnauthorized: false
//                 }
//             }
//
//         })
// try {
//     sequelize.authenticate()
//     console.log('Соединение с БД было успешно установлено')
// } catch (e) {
//     console.log('Невозможно выполнить подключение к БД: ', e)
// }
// module.exports = sequelize