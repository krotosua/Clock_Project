"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.SizeClock = exports.Rating = exports.Customer = exports.Master = exports.Order = exports.City = exports.CitiesMasters = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
class City extends sequelize_1.Model {
}
exports.City = City;
class CitiesMasters extends sequelize_1.Model {
}
exports.CitiesMasters = CitiesMasters;
class Customer extends sequelize_1.Model {
}
exports.Customer = Customer;
class Master extends sequelize_1.Model {
}
exports.Master = Master;
class Order extends sequelize_1.Model {
}
exports.Order = Order;
class Rating extends sequelize_1.Model {
}
exports.Rating = Rating;
class SizeClock extends sequelize_1.Model {
}
exports.SizeClock = SizeClock;
class User extends sequelize_1.Model {
}
exports.User = User;
CitiesMasters.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
}, {
    tableName: 'cities_masters',
    sequelize: db_1.default,
    timestamps: false
});
City.init({
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
    tableName: 'City',
    sequelize: db_1.default,
    timestamps: false
});
User.init({
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
    tableName: 'User',
    sequelize: db_1.default,
    timestamps: false
});
Customer.init({
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
    tableName: 'Customer',
    sequelize: db_1.default,
    timestamps: false
});
Master.init({
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
    tableName: 'Master',
    sequelize: db_1.default,
    timestamps: false
});
SizeClock.init({
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
    tableName: 'SizeClock',
    sequelize: db_1.default,
    timestamps: false
});
Order.init({
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
            model: City,
            key: 'id'
        }
    },
    time: { type: sequelize_1.DataTypes.DATE, },
    endTime: { type: sequelize_1.DataTypes.DATE },
    status: { type: sequelize_1.DataTypes.STRING, defaultValue: "WAITING" },
    price: { type: sequelize_1.DataTypes.INTEGER },
}, {
    tableName: 'Order',
    sequelize: db_1.default,
    timestamps: false
});
Rating.init({
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
    tableName: 'Rating',
    sequelize: db_1.default,
    timestamps: false
});
Master.hasMany(Order);
Order.belongsTo(Master, {
    foreignKey: {
        name: 'masterId'
    }
});
Master.hasMany(Rating, { onDelete: 'CASCADE' });
Rating.belongsTo(Master, {
    foreignKey: {
        name: 'masterId'
    }
});
Master.belongsToMany(City, { through: CitiesMasters, foreignKey: 'cityId' });
City.belongsToMany(Master, { through: CitiesMasters, foreignKey: 'masterId' });
User.hasOne(Rating, {
    foreignKey: {
        name: 'userId'
    }
});
Rating.belongsTo(User);
User.hasMany(Order);
Order.belongsTo(User, {
    foreignKey: {
        name: 'userId'
    }
});
User.hasOne(Customer, {
    foreignKey: {
        name: 'userId'
    }
});
Customer.belongsTo(User);
User.hasOne(Master, {
    onDelete: 'CASCADE', foreignKey: {
        name: 'userId'
    }
});
Master.belongsTo(User, { onDelete: 'CASCADE' });
Order.hasOne(Rating, { onDelete: 'CASCADE' });
Rating.belongsTo(Order, {
    foreignKey: {
        name: 'orderId'
    }
});
SizeClock.hasMany(Order);
Order.belongsTo(SizeClock, {
    foreignKey: {
        name: 'sizeClockId'
    }
});
