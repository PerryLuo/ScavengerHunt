'use strict';

var dataArray = require('../public/js/seederHelper').dataArray;
var neighborhoods = ['Wanchai', 'Admiralty', 'Central', 'Causeway Bay', 'Tsimshatsui'];
var districts = ['Hong Kong Island', 'Hong Kong Island', 'Hong Kong Island', 'Hong Kong Island', 'Kowloon West'];
var cities = ['Hong Kong', 'Hong Kong', 'Hong Kong', 'Hong Kong', 'Hong Kong'];
var states = ['Hong Kong SAR', 'Hong Kong SAR', 'Hong Kong SAR', 'Hong Kong SAR', 'Hong Kong SAR'];
var countries = ['China', 'China', 'China', 'China', 'China'];
var date = new Date();
var createdAts = [date, date, date, date, date];
var updatedAts = createdAts;

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.bulkInsert('locations',
            dataArray(
                ['neighborhood', 'district', 'city', 'state', 'country', 'createdAt', 'updatedAt'],
                [neighborhoods, districts, cities, states, countries, createdAts, updatedAts]
            )
        );
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.bulkDelete('locations', {
            neighborhood: neighborhoods
        });
    }
};
