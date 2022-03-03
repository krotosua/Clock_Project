const sequelize = require('../db')
const {DataTypes} = require('sequelize')

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {
        type: DataTypes.STRING, unique: true, allowNull: false,
        validate: {
            isEmail: true,
        }
    },
    password: {
        type: DataTypes.STRING,
    },
    role: {type: DataTypes.STRING, defaultValue: "USER"},
})

const Order = sequelize.define('order', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {
        type: DataTypes.STRING,
        validate: {
            notEmpty: true,
            len: [3, 10]
        }
    },
    date: {type: DataTypes.DATE}
})

const Master = sequelize.define('master', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {
        type: DataTypes.STRING, allowNull: false,
        validate: {notEmpty: true}
    },
    rating: {type: DataTypes.INTEGER, allowNull: false}
})
const City = sequelize.define('city', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {
        type: DataTypes.STRING, unique: true, allowNull: false,
        validate: {notEmpty: true}
    }
})
const SizeClock = sequelize.define('sizeClock', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {
        type: DataTypes.STRING, unique: true, allowNull: false,
        validate: {notEmpty: true,}
    },
    date: {type: DataTypes.TIME}
})
User.hasMany(Order)
Order.belongsTo(User)

Master.hasMany(Order)
Order.belongsTo(Master)

City.hasMany(Master)
Master.belongsTo(City, {onUpdate: "cascade"})

Order.belongsTo(SizeClock)
module.exports = {
    User,
    Order,
    City,
    Master,
    SizeClock
}