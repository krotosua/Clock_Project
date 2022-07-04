'use strict';
const sequelizeConnection = require("../db");
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('customers', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                name: {
                    type: Sequelize.STRING, allowNull: false,
                    validate: {notEmpty: true}
                },
            },
            {
                tableName: 'customers',
                modelName: 'customer',
                sequelize: sequelizeConnection,
                timestamps: false
            });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Customers');
    }
};