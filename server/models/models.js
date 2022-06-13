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
    status: {type: DataTypes.STRING, defaultValue: "WAITING"},
    price: {type: DataTypes.DOUBLE}
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
const Price = sequelize.define('price', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    price: {type: DataTypes.DOUBLE}
}, {timestamps: false})
const Rating = sequelize.define('rating', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    rating: {
        type: DataTypes.DOUBLE, allowNull: false,
        validate: {
            min: 0,
            max: 5
        }, defaultValue: 0
    }
}, {timestamps: false})


Master.hasMany(Order)
Order.belongsTo(Master)

Master.hasMany(Rating, {onDelete: 'CASCADE'})
Rating.belongsTo(Master)

User.hasOne(Rating,)
Rating.belongsTo(User)

User.hasMany(Order)
Order.belongsTo(User)

User.hasOne(Customer)
Customer.belongsTo(User)

User.hasOne(Master, {onDelete: 'CASCADE'})
Master.belongsTo(User, {onDelete: 'CASCADE'})

Order.hasOne(Rating, {onDelete: 'CASCADE'})
Rating.belongsTo(Order)

City.belongsToMany(SizeClock, {through: "price"})
SizeClock.belongsToMany(City, {through: "price"})
City.hasMany(Price)
Price.belongsTo(City)
SizeClock.hasMany(Price)
Price.belongsTo(City)


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
    Rating,
    Price
}