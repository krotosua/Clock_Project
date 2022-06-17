import cls from 'cls-hooked'
const namespace = cls.createNamespace('my-namespace')
import { Dialect, Sequelize } from 'sequelize'
Sequelize.useCLS(namespace)

const dbName = process.env.DB_NAME as string
const dbUser = process.env.DB_USER as string
const dbHost = process.env.DB_HOST

const dbDriver = 'postgres'
const dbPassword = process.env.DB_PASSWORD

const sequelizeConnection= new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port:5432,
    dialect: dbDriver,

})
export default sequelizeConnection