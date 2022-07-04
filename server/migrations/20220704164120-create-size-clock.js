'use strict';
const sequelizeConnection = require("../db");
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('sizeClocks', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                name: {
                    type: Sequelize.STRING, unique: true, allowNull: false,
                    validate: {notEmpty: true}
                },
                date: {type: Sequelize.TIME}
            },
            {
                tableName: 'sizeClocks',
                modelName: 'sizeClock',
                sequelize: sequelizeConnection,
                timestamps: false
            });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('sizeClocks');
    }
};