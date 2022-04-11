const {Sequelize} = require('sequelize')

const sequelize =
    new Sequelize("postgres://vdbaefzaqkvmwa:b58c35a5f79d18489ef6a1d569ca96b93fb6e733d61a6d7b5bb04f1518e8c103@ec2-34-231-63-30.compute-1.amazonaws.com:5432/dpaf98eifvbvu",

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