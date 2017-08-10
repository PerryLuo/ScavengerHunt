'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.createTable('gameplays', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING
            },
            huntId: {
                allowNull: false,
                type: Sequelize.INTEGER
            },
            organizerId: {
                type: Sequelize.INTEGER
            },
            startTime: {
                type: Sequelize.DATE
            },
            endTime: {
                type: Sequelize.DATE
            },
            durationHours: {
                type: Sequelize.FLOAT
            },
            playStatus: {
                type: Sequelize.STRING,
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
        return queryInterface.dropTable('gameplays');
    }
};
