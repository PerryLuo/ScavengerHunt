'use strict';
module.exports = function(sequelize, DataTypes) {
    var hunt = sequelize.define('hunt', {
        name: DataTypes.STRING,
        publicAccess: DataTypes.BOOLEAN,
        itinerary: DataTypes.ARRAY(DataTypes.ARRAY(DataTypes.INTEGER)),
        description: DataTypes.TEXT
    });
    hunt.associate = function(models) {
        hunt.hasMany(models.gameplay, {foreignKey: 'huntId'});
    };
    return hunt;
};
