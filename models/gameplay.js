'use strict';
module.exports = function(sequelize, DataTypes) {
    var gameplay = sequelize.define('gameplay', {
        name: DataTypes.STRING,
        huntId: DataTypes.INTEGER,
        organizerId: DataTypes.INTEGER,
        startTime: DataTypes.DATE,
        endTime: DataTypes.DATE
    });
    gameplay.associate = function(models) {
        gameplay.belongsTo(models.hunt, {foreignKey: 'huntId'});
        gameplay.belongsTo(models.user, {foreignKey: 'organizerId'});
        gameplay.hasMany(models.team, {foreignKey: 'gameplayId'});
        gameplay.hasMany(models.player, {foreignKey: 'gameplayId'});
    };
    return gameplay;
};
