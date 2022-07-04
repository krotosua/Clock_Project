'use strict';
const sequelizeConnection = require("../db");
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('rating', {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                rating: {
                    type: Sequelize.DOUBLE, allowNull: false,
                    validate: {
                        min: 0,
                        max: 5
                    }, defaultValue: 0
                },
                review: {type: Sequelize.TEXT, allowNull: true}
            },
            {
                tableName: 'rating',
                modelName: 'rating',
                sequelize: sequelizeConnection,
                timestamps: false
            });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Ratings');
    }
};