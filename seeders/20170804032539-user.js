'use strict';

var dataArray = require('../js/seederHelper').dataArray;
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
                ['email', 'firstName', 'lastName', 'createdAt', 'updatedAt'],
                [emails, firstNames, lastNames, createdAts, updatedAts]
            )
        );
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.bulkDelete('users', {
            email: emails
        });
    }
};
