"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CitiesMasters = exports.city = exports.sizeClock = exports.rating = exports.customer = exports.master = exports.order = exports.user = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
class city extends sequelize_1.Model {
}
exports.city = city;
class CitiesMasters extends sequelize_1.Model {
}
exports.CitiesMasters = CitiesMasters;
class customer extends sequelize_1.Model {
}
exports.customer = customer;
class master extends sequelize_1.Model {
}
exports.master = master;
class order extends sequelize_1.Model {
}
exports.order = order;
class rating extends sequelize_1.Model {
}
exports.rating = rating;
class sizeClock extends sequelize_1.Model {
}
exports.sizeClock = sizeClock;
class user extends sequelize_1.Model {
}
exports.user = user;
CitiesMasters.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
}, {
    tableName: 'cities_masters',
    sequelize: db_1.default,
    timestamps: false
});
city.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING, unique: true, allowNull: false,
        validate: { notEmpty: true }
    },
    price: { type: sequelize_1.DataTypes.INTEGER }
}, {
    tableName: 'cities',
    sequelize: db_1.default,
    timestamps: false
});
user.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: sequelize_1.DataTypes.STRING, unique: true, allowNull: false,
        validate: {
            isEmail: true,
        }
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
    },
    isActivated: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: false },
    role: { type: sequelize_1.DataTypes.STRING, defaultValue: "CUSTOMER" },
    activationLink: { type: sequelize_1.DataTypes.STRING }
}, {
    tableName: 'users',
    sequelize: db_1.default,
    timestamps: false
});
customer.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING, allowNull: false,
        validate: { notEmpty: true }
    },
}, {
    tableName: 'customers',
    sequelize: db_1.default,
    timestamps: false
});
master.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING, allowNull: false,
        validate: { notEmpty: true }
    },
    rating: {
        type: sequelize_1.DataTypes.DOUBLE, allowNull: false,
        validate: {
            min: 0,
            max: 5
        }, defaultValue: 0
    },
    isActivated: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: false }
}, {
    tableName: 'masters',
    sequelize: db_1.default,
    timestamps: false
});
sizeClock.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING, unique: true, allowNull: false,
        validate: { notEmpty: true }
    },
    date: { type: sequelize_1.DataTypes.TIME }
}, {
    tableName: 'sizeClocks',
    sequelize: db_1.default,
    timestamps: false
});
order.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        validate: {
            notEmpty: true,
            len: [3, 30]
        }
    },
    cityId: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: city,
            key: 'id'
        }
    },
    time: { type: sequelize_1.DataTypes.DATE, },
    endTime: { type: sequelize_1.DataTypes.DATE },
    status: { type: sequelize_1.DataTypes.STRING, defaultValue: "WAITING" },
    price: { type: sequelize_1.DataTypes.INTEGER },
}, {
    tableName: 'orders',
    sequelize: db_1.default,
    timestamps: false
});
rating.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    rating: {
        type: sequelize_1.DataTypes.DOUBLE, allowNull: false,
        validate: {
            min: 0,
            max: 5
        }, defaultValue: 0
    }
}, {
    tableName: 'ratings',
    sequelize: db_1.default,
    timestamps: false
});
master.hasMany(order);
order.belongsTo(master);
master.hasMany(rating, { onDelete: 'CASCADE' });
rating.belongsTo(master);
master.belongsToMany(city, { through: CitiesMasters });
city.belongsToMany(master, { through: CitiesMasters });
user.hasOne(rating);
rating.belongsTo(user);
user.hasMany(order);
order.belongsTo(user);
user.hasOne(customer);
customer.belongsTo(user);
user.hasOne(master, { onDelete: 'CASCADE' });
master.belongsTo(user, { onDelete: 'CASCADE' });
order.hasOne(rating, { onDelete: 'CASCADE' });
rating.belongsTo(order);
sizeClock.hasMany(order);
order.belongsTo(sizeClock);
