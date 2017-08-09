'use strict';

var dataArray = require('../public/js/seederHelper').dataArray;
var googleIds = ['', '106042834711120410141', '104515843863940371388'];
var emails = ['miguelps63@gmail.com', 'perry.luo@gmail.com', 'leung.hm@gmail.com'];
var firstNames = ['Miguel', 'Perry', 'Herman'];
var lastNames = ['Suay', 'Luo', 'Leung'];
var date = new Date();
var createdAts = [date, date, date];
var updatedAts = createdAts;

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.bulkInsert('users',
            dataArray(
                ['email', 'googleId', 'firstName', 'lastName', 'createdAt', 'updatedAt'],
                [emails, googleIds, firstNames, lastNames, createdAts, updatedAts]
            )
        );
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.bulkDelete('users', {
            email: emails
        });
    }
};
