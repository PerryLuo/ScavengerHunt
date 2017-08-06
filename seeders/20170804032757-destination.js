'use strict';

var dataArray = require('../js/seederHelper').dataArray;
var names = ["WeWork", "Southern Playground", "Expo Promenade", 'Butchers Club', 'Sikh Temple', 'Hung Sing Temple', 'Hing Kee Wontons', 'Coyote Bar & Grill', "Paisano's Pizzeria", "Amoy Street", 'Hong Kong Cemetery', 'Tamar Park', 'Hong Kong Park', 'Victoria Park', 'Hong Kong Cultural Centre'];
var latitudes = [22.278357,22.276936,22.284805,22.276957,22.27454,22.275427,22.278593,22.278019,22.277203,22.275874,22.270909,22.281712,22.277653,22.282595,22.293778];
var longitudes = [114.17006,114.172332,114.17331,114.169195,114.177979,114.170839,114.172965,114.172558,114.173469,114.172088,114.179845,114.165719,114.161874,114.189232,114.17035];
var descriptions = ['Find Accelerate on the 8th floor!', 'The playground sits on what used to be the Victoria Harbour!', 'This promenade has the best coastal view of the Victoria Harbor!', 'The fries here are cooked with duck fat. Yum!', 'Free food is served here!', 'This temple was built around 1847!', 'They have some of the best wontons in Hong Kong!', 'Lunch buffets are a deal here (although the meats don\'t taste Mexican at all...)', 'Yummy', 'Amoy is the old name for the city of Xiamen', 'There are 5 cemeteries here of 5 different faiths/denominations!', 'All the major government bodies are located here!', 'They used to house a tiger, a leopard, and a gorilla!', 'This park used to be a typhoon shelter!', 'Prince Charles and Princess Diana officiated the opening of this centre!'];
var locationIds = [1,1,1,1,1,1,1,1,1,1,1,2,3,4,5];
var date = new Date();
var createdAts = [date, date, date, date, date, date, date, date, date, date, date, date, date, date, date];
var updatedAts = createdAts;

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.bulkInsert('destinations',
            dataArray(
                ['name', 'latitude', 'longitude', 'description', 'locationId', 'createdAt', 'updatedAt'],
                [names, latitudes, longitudes, descriptions, locationIds, createdAts, updatedAts]
            )
        );
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.bulkDelete('destinations',
            {name: names}
        );
    }
};
