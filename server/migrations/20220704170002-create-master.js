'use strict';
const sequelizeConnection = require("../db");
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('masters', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                name: {
                    type: Sequelize.STRING, allowNull: false,
                    validate: {notEmpty: true}
                },
                rating: {
                    type: Sequelize.DOUBLE, allowNull: false,
                    validate: {
                        min: 0,
                        max: 5
                    }, defaultValue: 0
                },
                isActivated: {type: Sequelize.BOOLEAN, defaultValue: false}
            },
            {
                tableName: 'masters',
                modelName: 'master',
                sequelize: sequelizeConnection,
                timestamps: false
            });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Masters');
    }
};