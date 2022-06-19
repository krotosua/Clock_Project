import cls from 'cls-hooked'
import {Sequelize} from 'sequelize'

const namespace = cls.createNamespace('my-namespace')

Sequelize.useCLS(namespace)

const dbName = process.env.DB_NAME as string
const dbUser = process.env.DB_USER as string
const dbHost = process.env.DB_HOST
const dbPort = Number(process.env.DB_PORT)
const dbDriver = 'postgres'
const dbPassword = process.env.DB_PASSWORD

const sequelizeConnection = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: dbDriver,

})
export default sequelizeConnection