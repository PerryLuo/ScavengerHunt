'use strict';

var dataArray = require('../public/js/seederHelper').dataArray;
var names = ['Wontons', 'Spicy', 'Slow', 'P', 'M', 'H'];
var gameplayIds = [1,1,1,2,2,2];
var scores = [0,0,0,0,0,0];
var date = new Date();
var createdAts = [date, date, date, date, date, date];
var updatedAts = createdAts;

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.bulkInsert('teams',
            dataArray(
                ['name', 'gameplayId', 'score', 'createdAt', 'updatedAt'],
                [names, gameplayIds, scores, createdAts, updatedAts]
            )
        );
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.bulkDelete('teams',
            {name: names}
        );
    }
};
