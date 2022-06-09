const cls = require('cls-hooked')
const namespace = cls.createNamespace('my-namespace')
const {Sequelize} = require('sequelize')
Sequelize.useCLS(namespace)
const sequelize =
    new Sequelize(process.env.DATABASE,
        {
            dialect: 'postgres',
            protocol: 'postgres',
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                }
            }

        })
try {
    sequelize.authenticate()
    console.log('Соединение с БД было успешно установлено')
} catch (e) {
    console.log('Невозможно выполнить подключение к БД: ', e)
}
module.exports = sequelize