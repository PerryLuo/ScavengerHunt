'use strict';
module.exports = function(sequelize, DataTypes) {
    var location = sequelize.define('location', {
        neighborhood: DataTypes.STRING,
        district: DataTypes.STRING,
        city: DataTypes.STRING,
        state: DataTypes.STRING,
        country: DataTypes.STRING
    });
    location.associate = function(models) {
        location.hasMany(models.destination, {foreignKey: 'locationId'});
    };
    return location;
};
