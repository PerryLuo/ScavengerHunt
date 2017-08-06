'use strict';
module.exports = function(sequelize, DataTypes) {
    var task = sequelize.define('task', {
        score: DataTypes.INTEGER,
        destinationId: DataTypes.INTEGER,
        type: DataTypes.STRING,
        name: DataTypes.STRING,
        question: DataTypes.STRING,
        answer: DataTypes.STRING
    });
    task.associate = function(models) {
        task.belongsTo(models.destination, {foreignKey: 'destinationId'});
    };
    return task;
};
