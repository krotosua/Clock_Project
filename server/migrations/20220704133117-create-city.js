'use strict';
const sequelizeConnection = require("../db");
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('cities', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                name: {
                    type: Sequelize.STRING, unique: true, allowNull: false,
                    validate: {notEmpty: true}
                },
                price: {type: Sequelize.INTEGER}
            },
            {
                tableName: 'cities',
                modelName: 'city',
                sequelize: sequelizeConnection,
                timestamps: false
            });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('cities');
    }
};