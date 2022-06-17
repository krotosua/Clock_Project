import {
    Association, DataTypes, HasManyAddAssociationMixin, HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin,
    HasManySetAssociationsMixin, HasManyAddAssociationsMixin, HasManyHasAssociationsMixin,
    HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, Model, ModelDefined, Optional,
    Sequelize, InferAttributes, InferCreationAttributes, CreationOptional, NonAttribute,
} from "sequelize";
import sequelizeConnection from "../db";

interface CityAttributes {
    id: number;
    name: string;
    price: number;
    masters?: Array<master>
}

interface UserAttributes {
    id: number;
    email: string;
    password: string;
    role: string;
    isActivated?: boolean;
    activationLink?: string;
    master?: { name: string, orders?: Array<order>, id?: number };
    customer?: { name: string };
    customerId?:number
    masterId?:number
    orders?: Array<order>
}

interface CitiesMastersAttributes {
    id: number;
    cityId?: number
    masterId?: number
}

interface CustomerAttributes {
    id: number;
    name: string;
    userId?: number;

}

interface MasterAttributes {
    id: number;
    name: string;
    rating: number;
    isActivated: boolean;
    orders?: Array<order>
    userId?: number
}

interface RatingAttributes {
    id: number;
    rating: number;
    orderId?: number
    masterId?: number
    userId?: number

}

interface SizeClockAttributes {
    id: number;
    name: string;
    date: string;
    orders?: Array<order>
}


interface OrderAttributes {
    id: number;
    name: string;
    time: Date;
    endTime: Date;
    status?: string | undefined;
    price: number;
    sizeClockId?: number
    masterId?: number
    cityId: number
    userId?: number
}

export interface CityInput extends Optional<CityAttributes, 'id'> {
}

export interface CityOutput extends Required<CityAttributes> {
}

class city extends Model<CityAttributes, CityInput>
    implements CityAttributes {
    public id!: number
    public name!: string
    public price!: number;
    public masters?: Array<master>
}

export interface CitiesMastersInput extends Optional<CitiesMastersAttributes, 'id'> {
}

export interface CitiesMastersOutput extends Required<CitiesMastersAttributes> {
}

class CitiesMasters extends Model<CitiesMastersAttributes, CitiesMastersInput>
    implements CitiesMastersAttributes {
    public id!: number
    declare cityId: number
    declare masterId: number
}

export interface CustomerInput extends Optional<CustomerAttributes, 'id'> {
}

export interface CustomerOutput extends Required<CustomerAttributes> {
}

class customer extends Model<CustomerAttributes, CustomerInput>
    implements CustomerAttributes {
    public id!: number
    public name!: string;
    declare userId?:number
}

export interface MasterInput extends Optional<MasterAttributes, 'id'> {
}

export interface MasterOutput extends Required<MasterAttributes> {
}

class master extends Model<MasterAttributes, MasterInput>
    implements MasterAttributes {
    public id!: number
    public name!: string
    public rating!: number;
    public isActivated!: boolean;
    public orders?: Array<order>
    declare addUser: HasManyAddAssociationMixin<user, number>;
    declare addCities: HasManyAddAssociationsMixin<city, number>
    declare setCities: HasManySetAssociationsMixin<city, number>
}

export interface OrderInput extends Optional<OrderAttributes, 'id'> {
}

export interface OrderOutput extends Required<OrderAttributes> {
}

class order extends Model<OrderAttributes, OrderInput>
    implements OrderAttributes {
    public id!: number;
    public name!: string;
    public time!: Date;
    public endTime!: Date;
    public status?: string | undefined;
    public price!: number;
    declare sizeClockId?: number
    declare masterId?: number
    declare cityId: number
    declare userId?: number
}

export interface RatingInput extends Optional<RatingAttributes, 'id'> {
}

export interface RatingOutput extends Required<RatingAttributes> {
}

class rating extends Model<RatingAttributes, RatingInput>
    implements RatingAttributes {
    public id!: number;
    public rating!: number;
    declare orderId: number
    declare masterId: number
    declare userId: number
    declare addOrder: HasManyAddAssociationMixin<order, number>;
    declare addMaster: HasManyAddAssociationMixin<master, number>;
    declare addUser: HasManyAddAssociationMixin<user, number>;
}

export interface SizeClockInput extends Optional<SizeClockAttributes, 'id'> {
}

export interface SizeClockOutput extends Required<SizeClockAttributes> {
}

class sizeClock extends Model<SizeClockAttributes, SizeClockInput>
    implements SizeClockAttributes {
    public id!: number
    public name!: string
    public date!: string;
    public orders?: Array<order>
}

export interface UserInput extends Optional<UserAttributes, 'id' | "password" | "role"> {
}

export interface UserOutput extends Required<UserAttributes> {
}

class user extends Model<UserAttributes, UserInput>
    implements UserAttributes {
    public id!: number
    public email!: string
    public password!: string;
    public role!: string;
    public isActivated?: boolean;
    public master?: { name: string, orders?: Array<order>, id?: number };
    public customer?: { name: string };
    public readonly activationLink?: string;
    public orders?: Array<order>
    declare customerId?:number
    declare masterId?:number
    declare getCustomer: HasManyGetAssociationsMixin<customer>;
    declare getMaster: HasManyGetAssociationsMixin<master>;
}

CitiesMasters.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
    },
    {
        tableName: 'cities_masters',
        sequelize: sequelizeConnection,
        timestamps: false
    })
city.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING, unique: true, allowNull: false,
            validate: {notEmpty: true}
        },
        price: {type: DataTypes.INTEGER}
    },
    {
        tableName: 'cities',
        sequelize: sequelizeConnection,
        timestamps: false
    })

user.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING, unique: true, allowNull: false,
            validate: {
                isEmail: true,
            }
        },
        password: {
            type: DataTypes.STRING,
        },
        isActivated: {type: DataTypes.BOOLEAN, defaultValue: false},
        role: {type: DataTypes.STRING, defaultValue: "CUSTOMER"},
        activationLink: {type: DataTypes.STRING}
    },
    {
        tableName: 'users',
        sequelize: sequelizeConnection,
        timestamps: false
    })

customer.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING, allowNull: false,
            validate: {notEmpty: true}
        },
    },
    {
        tableName: 'customers',
        sequelize: sequelizeConnection,
        timestamps: false
    })

master.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
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
        isActivated: {type: DataTypes.BOOLEAN, defaultValue: false}
    },
    {
        tableName: 'masters',
        sequelize: sequelizeConnection,
        timestamps: false
    })
sizeClock.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING, unique: true, allowNull: false,
            validate: {notEmpty: true}
        },
        date: {type: DataTypes.TIME}
    },
    {
        tableName: 'sizeClocks',
        sequelize: sequelizeConnection,
        timestamps: false
    })

order.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
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
            model: city,
            key: 'id'
        }},
        time: {type: DataTypes.DATE,},
        endTime: {type: DataTypes.DATE},
        status: {type: DataTypes.STRING, defaultValue: "WAITING"},
        price: {type: DataTypes.INTEGER},

    },
    {
        tableName: 'orders',
        sequelize: sequelizeConnection,
        timestamps: false
    })

rating.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        rating: {
            type: DataTypes.DOUBLE, allowNull: false,
            validate: {
                min: 0,
                max: 5
            }, defaultValue: 0
        }
    },
    {
        tableName: 'ratings',
        sequelize: sequelizeConnection,
        timestamps: false
    })
master.hasMany(order)
order.belongsTo(master)

master.hasMany(rating, {onDelete: 'CASCADE'})
rating.belongsTo(master)

master.belongsToMany(city, {through: CitiesMasters})
city.belongsToMany(master, {through: CitiesMasters})


user.hasOne(rating,)
rating.belongsTo(user)

user.hasMany(order)
order.belongsTo(user)

user.hasOne(customer)
customer.belongsTo(user)

user.hasOne(master, {onDelete: 'CASCADE'})
master.belongsTo(user, {onDelete: 'CASCADE'})

order.hasOne(rating, {onDelete: 'CASCADE'})
rating.belongsTo(order)


sizeClock.hasMany(order)
order.belongsTo(sizeClock)

export {
    user,
    order,
    master,
    customer,
    rating,
    sizeClock,
    city,
    CitiesMasters
}