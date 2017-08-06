'use strict';
module.exports = function(sequelize, DataTypes) {
    var destination = sequelize.define('destination', {
        name: DataTypes.STRING,
        latitude: DataTypes.DOUBLE,
        longitude: DataTypes.DOUBLE,
        description: DataTypes.TEXT,
        locationId: DataTypes.INTEGER,
    });
    destination.associate = function(models) {
        destination.belongsTo(models.location, {foreignKey: 'locationId'});
        destination.hasMany(models.task, {foreignKey: 'destinationId'});
    };
    return destination;
};
