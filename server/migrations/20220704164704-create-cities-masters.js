'use strict';
const {DataTypes} = require("sequelize");
const sequelizeConnection = require("../db");
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('cities_masters', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                }
            },
            {
                tableName: 'cities_masters',
                modelName: 'cities_masters',
                sequelize: sequelizeConnection,
                timestamps: false
            });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('CitiesMasters');
    }
};