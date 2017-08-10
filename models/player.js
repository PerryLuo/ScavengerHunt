'use strict';
module.exports = function(sequelize, DataTypes) {
    var player = sequelize.define('player', {
        userId: DataTypes.INTEGER,
        gameplayId: DataTypes.INTEGER,
        teamId: DataTypes.INTEGER,
        score: DataTypes.INTEGER,
        itineraryIndex: DataTypes.INTEGER
    });
    player.associate = function(models) {
        player.belongsTo(models.user, {foreignKey: 'userId'});
        player.belongsTo(models.team, {foreignKey: 'teamId'});
        player.belongsTo(models.gameplay, {foreignKey: 'gameplayId'});
    };
    return player;
};
