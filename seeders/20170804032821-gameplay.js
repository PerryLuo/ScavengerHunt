'use strict';

var dataArray = require('../js/seederHelper').dataArray;
var names = ['Food', 'Spacious places'];
var huntIds = [1,2];
var organizerIds = [2,3];
var date = new Date();
var createdAts = [date, date];
var updatedAts = createdAts;

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.bulkInsert('gameplays',
            dataArray(
                ['name', 'huntId', 'organizerId', 'createdAt', 'updatedAt'],
                [names, huntIds, organizerIds, createdAts, updatedAts]
            )
        );
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.bulkDelete('gameplays',
            {name: names}
        );
    }
};
