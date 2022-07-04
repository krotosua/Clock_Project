'use strict';
const {DataTypes} = require("sequelize");
const {STATUS} = require("../dist/dto/order.dto");
const sequelizeConnection = require("../db");
const City = require("../dist/models/models");
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('orders', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                name: {
                    type: Sequelize.STRING,
                    validate: {
                        notEmpty: true,
                        len: [3, 30]
                    }
                },
                time: {type: DataTypes.DATE,},
                endTime: {type: DataTypes.DATE},
                cityId: {
                    type: DataTypes.INTEGER,
                    references: {
                        model: {
                            tableName: 'cities',
                        },
                        key: 'id',
                    },
                    allowNull: false,
                },
                userId: {
                    type: DataTypes.INTEGER,
                    references: {
                        model: {
                            tableName: 'users',
                        },
                        key: 'id',
                    },
                    allowNull: false,
                },
                sizeClockId: {
                    type: DataTypes.INTEGER,
                    references: {
                        model: {
                            tableName: 'cities',
                        },
                        key: 'id',
                    },
                    allowNull: false,
                },
                status: {
                    type: Sequelize.ENUM(STATUS.WAITING, STATUS.REJECTED, STATUS.ACCEPTED, STATUS.DONE),
                    defaultValue: STATUS.WAITING
                },
                price: {type: Sequelize.INTEGER},
                ratingLink: {type: Sequelize.STRING}
            },
            {
                tableName: 'orders',
                modelName: 'order',
                sequelize: sequelizeConnection,
                timestamps: false
            });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Orders');
    }
};