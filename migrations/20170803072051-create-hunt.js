'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
        return queryInterface.createTable('hunts', {
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
            publicAccess: { type: Sequelize.BOOLEAN },
            itinerary: {
                allowNull: false,
                type: Sequelize.ARRAY(Sequelize.ARRAY(Sequelize.INTEGER))
            },
            description: { type: Sequelize.TEXT },
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
        return queryInterface.dropTable('hunts');
    }
};
