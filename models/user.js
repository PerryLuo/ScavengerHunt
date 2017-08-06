'use strict';
module.exports = function(sequelize, DataTypes) {
    var user = sequelize.define('user', {
        email: DataTypes.STRING,
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING
    });
    user.associate = function(models) {
        user.hasMany(models.gameplay, {foreignKey: 'organizerId'});
        user.hasMany(models.player, {foreignKey: 'userId'});
    };
    return user;
};
