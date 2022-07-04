'use strict';

const {ROLES} = require("../dist/dto/global");
const sequelizeConnection = require("../db");
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('users', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                email: {
                    type: Sequelize.STRING, unique: true, allowNull: false,
                    validate: {
                        isEmail: true,
                    }
                },
                password: {
                    type: Sequelize.STRING,
                },
                isActivated: {type: Sequelize.BOOLEAN, defaultValue: false},
                role: {type: Sequelize.ENUM(ROLES.CUSTOMER, ROLES.MASTER, ROLES.ADMIN), defaultValue: ROLES.CUSTOMER},
                activationLink: {type: Sequelize.STRING}
            },
            {
                tableName: 'users',
                modelName: 'user',
                sequelize: sequelizeConnection,
                timestamps: false
            });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Users');
    }
};