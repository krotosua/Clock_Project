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
    role: {type: DataTypes.STRING, defaultValue: "CUSTOMER"},
    isActivated: {type: DataTypes.BOOLEAN, defaultValue: false},
    activationLink: {type: DataTypes.STRING}

}, {timestamps: false})

const Master = sequelize.define('master', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {
        type: DataTypes.STRING, allowNull: false,
        validate: {notEmpty: true}
    },
    rating: {
        type: DataTypes.DOUBLE, allowNull: false,
        validate: {
            min: 0,
            max: 5
        }, defaultValue: 0
    },
    isActivated: {type: DataTypes.BOOLEAN, defaultValue: false},
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
    time: {type: DataTypes.DATE,},
    endTime: {type: DataTypes.DATE},
    finished:{type: DataTypes.BOOLEAN, defaultValue: false},
}, {timestamps: false})
const CitiesMasters = sequelize.define('cities_masters', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
}, {timestamps: false})
const Customer = sequelize.define('customer', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {
        type: DataTypes.STRING, allowNull: false,
        validate: {notEmpty: true}
    },
}, {timestamps: false})
const Rating = sequelize.define('rating', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    rating: {
        type: DataTypes.INTEGER, allowNull: false,
        validate: {
            min: 0,
            max: 5
        }, defaultValue: 0}})

Master.hasMany(Rating,{onDelete: 'CASCADE'})
Rating.belongsTo(Master)

User.hasOne(Rating,)
Rating.belongsTo(User)

Order.hasOne(Rating,{onDelete: 'CASCADE'})
Rating.belongsTo(Order)

User.hasMany(Order)
Order.belongsTo(User)


User.hasOne(Customer)
Customer.belongsTo(User)

User.hasOne(Master, {onDelete: 'CASCADE'})
Master.belongsTo(User, {onDelete: 'CASCADE'})

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
    CitiesMasters,
    Customer,
    Rating
}