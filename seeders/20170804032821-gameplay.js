'use strict';

var dataArray = require('../public/js/seederHelper').dataArray;
var names = ['Food', 'Spacious places'];
var huntIds = [1,2];
var organizerIds = [2,3];
var playStatuses = ['unstarted', 'unstarted'];
var date = new Date();
var createdAts = [date, date];
var updatedAts = createdAts;

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.bulkInsert('gameplays',
            dataArray(
                ['name', 'huntId', 'organizerId', 'playStatus', 'createdAt', 'updatedAt'],
                [names, huntIds, organizerIds, playStatuses, createdAts, updatedAts]
            )
        );
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.bulkDelete('gameplays',
            {name: names}
        );
    }
};
