'use strict';

var dataArray = require('../js/seederHelper').dataArray;
var scores = ['100','100','100','100','200','200','200','100','100','100','300','300','200','100','200'];
var destinationIds = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
var types = ['question','question','question','question','question','question','question','question','question','question','question','question','question','question','question'];
var names = ["Where?", "How many?", "How many?", "How much?", "When?", "How many?", "How much?", "What?", "How much?", "How many?", "Find me", "What?", "How many?", "What?", "How many?"];
var questions = ["Which floor number is the general lobby of WeWork? (enter number only)","How many basketball courts are there?","How many petals does the golden flower statue have?","What's the price of the lunch special? (enter number only)","Which year was the main building of the temple built?","How many Chinese characters are there in total on the red wooden plaques on both sides of the main entrance?","What's the cheapest bowl of noodles cost? (enter number only)","What kind of food do they serve?","How much does a slice of pepperoni pizza cost? (enter number)","How many Thai restaurants are on this street?","Find the main entrance to the Parsee Cemetery. Enter the number you find on the top left corner of the gate.","Look for the sculpture that is red and green. What is it? (one word)","Go to the Olympic Square. How many columns are there in total?","Find the statue of Queen Victoria. What animal is her right elbow resting on?","Count the number of slanted columns on the harbor-facing side of the building."];
var answers = ['10','4','5','100','1938','32','21','Mexican','30','3','1222','key','30','lion','38'];
var date = new Date();
var createdAts = [date, date, date, date, date, date, date, date, date, date, date, date, date, date, date];
var updatedAts = createdAts;

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.bulkInsert('tasks',
            dataArray(
                ['score', 'destinationId', 'type', 'name', 'question', 'answer', 'createdAt', 'updatedAt'],
                [scores, destinationIds, types, names, questions, answers, createdAts, updatedAts]
            )
        );
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.bulkDelete('tasks',
            {question: questions}
        );
    }
};
