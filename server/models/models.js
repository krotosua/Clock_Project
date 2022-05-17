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

}, {timestamps: false})

const Master = sequelize.define('master', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {
        type: DataTypes.STRING, allowNull: false,
        validate: {notEmpty: true}
    },
    rating: {
        type: DataTypes.INTEGER, allowNull: false,
        validate: {
            min: 0,
            max: 5
        }
    }
}, {timestamps: false})
const City = sequelize.define('city', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {
        type: DataTypes.STRING, unique: true, allowNull: false,
        validate: {notEmpty: true}
    }
}, {timestamps: false})
const SizeClock = sequelize.define('sizeClock', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {
        type: DataTypes.STRING, unique: true, allowNull: false,
        validate: {notEmpty: true,}
    },
    date: {type: DataTypes.TIME}
}, {timestamps: false})
const Order = sequelize.define('order', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {
        type: DataTypes.STRING,
        validate: {
            notEmpty: true,
            len: [3, 30]
        }
    },
    cityId: {
        type: DataTypes.INTEGER,
        references: {
            model: City,
            key: 'id'
            
        }
    },
    date: {type: DataTypes.DATEONLY,},
    time: {type: DataTypes.TIME,},
    endTime: {type: DataTypes.TIME}
}, {timestamps: false})
const CitiesMasters = sequelize.define('cities_masters', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
}, {timestamps: false})
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