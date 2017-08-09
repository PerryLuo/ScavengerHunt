'use strict';
module.exports = function(sequelize, DataTypes) {
    var team = sequelize.define('team', {
        name: DataTypes.STRING,
        gameplayId: DataTypes.INTEGER,
        score: DataTypes.INTEGER
    });
    team.associate = function(models) {
        team.belongsTo(models.gameplay, {foreignKey: 'gameplayId'});
        team.hasMany(models.player, {foreignKey: 'teamId'});
    };
    return team;
};
