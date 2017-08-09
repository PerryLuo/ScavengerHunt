'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.createTable('users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            googleId: {
                unique: true,
                type: Sequelize.STRING
            },
            email: {
                unique: true,
                type: Sequelize.STRING,
                validate: {isEmail: true}
            },
            firstName: { type: Sequelize.STRING },
            lastName: { type: Sequelize.STRING },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: function(queryInterface, Sequelize) {
        return queryInterface.dropTable('users');
    }
};
