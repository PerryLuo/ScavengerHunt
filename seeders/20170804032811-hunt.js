'use strict';

var dataArray = require('../js/seederHelper').dataArray;
var names = ['Food Tour', 'Walk Tour'];
var publicAccesses = ['true', 'true'];
var itineraries = [ [[1,1],[7,7],[8,8],[9,9],[5,5],[10,10],[4,4]], [[1,1],[2,2],[14,14],[3,3],[15,15],[12,12],[13,13]] ];
var descriptions = ['Check out some food places nearby!', "Check out some open spaces nearby!"];
var date = new Date();
var createdAts = [date, date, date, date, date, date, date, date, date, date, date, date, date, date, date];
var updatedAts = createdAts;

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.bulkInsert('hunts',
            dataArray(
                ['name', 'publicAccess', 'itinerary', 'description', 'createdAt', 'updatedAt'],
                [names, publicAccesses, itineraries, descriptions, createdAts, updatedAts]
            )
        );
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.bulkDelete('hunts',
            {name: names}
        );
    }
};
