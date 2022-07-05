import cls from 'cls-hooked'
import {Sequelize} from 'sequelize'

const namespace = cls.createNamespace('my-namespace')

Sequelize.useCLS(namespace)

export const dbName = process.env.DB_NAME as string
export const dbUser = process.env.DB_USER as string
export const dbHost = process.env.DB_HOST
export const dbPort = Number(process.env.DB_PORT)
export const dbDriver = 'postgres'
export const dbPassword = process.env.DB_PASSWORD

const sequelizeConnection = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: dbDriver,

})
export default sequelizeConnection