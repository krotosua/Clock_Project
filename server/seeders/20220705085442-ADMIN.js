'use strict';

const bcrypt = require("bcrypt");
module.exports = {
    async up(queryInterface, Sequelize) {
        return await queryInterface.bulkInsert('users', [{
            email: 'admin@example.com',
            password: await bcrypt.hash("passwordsecret", 5),
            isActivated: true,
            role: "ADMIN"
        }
        ], {});
    },

    async down(queryInterface, Sequelize) {
        return await queryInterface.bulkDelete('users', null, {});
    }
};
