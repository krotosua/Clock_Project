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
    nameCit: {
        type: DataTypes.STRING,
        allowNull: true
    },
    date: {type: DataTypes.DATEONLY},
    time: {type: DataTypes.TIME}
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
const CitiesMasters = sequelize.define('cities_masters', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})
User.hasMany(Order)
Order.belongsTo(User)

Master.hasMany(Order)
Order.belongsTo(Master)

City.belongsToMany(Master, {through: CitiesMasters})
Master.belongsToMany(City, {through: CitiesMasters})

SizeClock.hasMany(Order)
Order.belongsTo(SizeClock)
module.exports = {
    User,
    Order,
    City,
    Master,
    SizeClock,
    CitiesMasters
}