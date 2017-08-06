'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.createTable('tasks', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            score: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            destinationId: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            type: {
                type: Sequelize.STRING
            },
            name: {
                type: Sequelize.STRING
            },
            question: {
                allowNull: false,
                type: Sequelize.STRING
            },
            answer: {
                allowNull: false,
                type: Sequelize.STRING
            },
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
        return queryInterface.dropTable('tasks');
    }
};
