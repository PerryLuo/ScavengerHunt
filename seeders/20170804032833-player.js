'use strict';

var dataArray = require('../public/js/seederHelper').dataArray;
var userIds = [1,2,3,1,2,3];
var gameplayIds = [1,1,1,2,2,2];
var teamIds = [1,2,3,4,5,6];
var scores = [0,0,0,0,0,0];
var date = new Date();
var createdAts = [date, date, date, date, date, date];
var updatedAts = createdAts;

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.bulkInsert('players',
            dataArray(
                ['userId', 'gameplayId', 'teamId', 'score', 'createdAt', 'updatedAt'],
                [userIds, gameplayIds, teamIds, scores, createdAts, updatedAts]
            )
        );
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.bulkDelete('players',
            {teamId: teamIds}
        );
    }
};
