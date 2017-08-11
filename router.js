//router.js
const passport = require('passport');
const User = require('./models').user;
const Hunt = require('./models').hunt;
const Destination = require('./models').destination;
const Task = require('./models').task;
const Gameplay = require('./models').gameplay;
const Player = require('./models').player;

module.exports = (express) => {

    const router = express.Router();

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) return next();
        res.redirect('/gamemenu');
    }

    router.get('/public/js/:file', (req, res) => {
        res.sendFile(__dirname + '/js/' + req.params.file);
    });
    router.get('/public/css/main.css', (req, res) => {
        res.sendFile(__dirname + '/css/main.css');
    });
    router.get('/public/art/:file', (req, res) => {
        res.sendFile(__dirname + '/art/' + req.params.file);
    });

    router.get('/login', (req, res) => {
        res.render('login');
    });

    router.get('/auth/google', passport.authenticate('google', {scope: ['profile']}));
    router.get('/auth/google/googletoken',
        passport.authenticate('google', { failureRedirect: '/login' }),
        function(req, res) {
            res.redirect('/gamemenu');
      });

    router.get('/gamemenu', isLoggedIn, (req, res) => {
        res.render('gamemenu');
    });

    router.get('/gamesetup', isLoggedIn, (req, res) => {
        res.render('gamesetup');
    });

    router.post('/creategame', isLoggedIn, (req, res) => {
        Hunt.findOne({
            where:{id: req.body.hunt}
        })
        .then( hunt => {
            Gameplay.create({
                name: req.body.gamename,
                huntId: req.body.hunt,
                organizerId: req.session.passport.user,
                playStatus: 'unstarted'
            })
            .then(gameplay => {
                Player.create({
                    userId: req.session.passport.user,
                    gameplayId: gameplay.dataValues.id,
                    score: 0,
                    itineraryIndex: 0
                });
                res.json({gameplayId: gameplay.dataValues.id});
            });
        }).catch(err => console.log(err));
    });

    router.get('/configureGame', isLoggedIn, (req, res) => {

        Gameplay.findAll({
            where:{
                organizerId: req.session.passport.user,
                $or:[
                    {playStatus: {$eq: 'unstarted'}},
                    {playStatus: {$eq: 'ongoing'}}
                ]
            },
            include: [{model: Player, include: [User]}]
        })
        .then(function (unstartedGame) {
            console.log(unstartedGame[0]);
            var unstartedgame = unstartedGame.map(function(data){
                return {
                    name: data.dataValues.name,
                    id: data.dataValues.id,
                    playersNames: (data.dataValues.players.map( each => {
                        return each.dataValues.user.dataValues.firstName + ' ' + each.dataValues.user.dataValues.lastName;
                    })).join(', ')
                };
            });
            res.json(unstartedgame);
        });
    });

    router.post('/playstatus', isLoggedIn, (req, res) => {
        Gameplay.update({
            playStatus: req.body.playStatus,
        }, {
            where: {
                organizerId: req.session.passport.user,
                name: req.body.gamename
            }
        })
        .then( game => {
            res.send('done');
        });
    });

    router.post('/joingame', isLoggedIn, (req, res) => {
        var status = 'invalid';
        var alert = '';
        Gameplay.findOne({
            where: {id: req.body.joingame}
        })
        .then(function(gameData){ // NOTE: actually still need to check if player is already in game
            if (!gameData) {
                alert = "Invalid game id";
            } else if (gameData.dataValues.playStatus === 'ended') {
                alert = "Game has ended and can no longer be joined";
            } else if (gameData.dataValues.playStatus === 'unstarted') {
                status = 'valid';
                alert = "You have (already) joined '" + gameData.dataValues.name +
                        "', but it hasn't begun yet! <br>Click 'Start Game' to see \
                        the games you have joined and to enter one that has begun.";
            } else if (gameData.dataValues.playStatus === 'ongoing') {
                status = 'valid';
                alert = "You have (already) joined '" + gameData.dataValues.name +
                        "', and it has already begun! <br>Click 'Start Game', find \
                        your game, and click on it to enter the game.";
            }
            if (status === 'valid') {
                Player.findOrCreate({where: {
                    userId: req.session.passport.user,
                    gameplayId: gameData.dataValues.id,
                    score: 0,
                    itineraryIndex: 0,
                }});
            }
        })
        .then(() => {
            res.json({alert: alert});
        }).catch(err => console.log(err));
    });

    router.get('/viewgames', isLoggedIn, (req, res) => {
        Player.findAll({
            where: {userId: req.session.passport.user}
        })
        .then(function(players){
            var gameplayIds = players.map(function(data){
                return data.dataValues.gameplayId;
            });
            Gameplay.findAll({
                where: {id: gameplayIds},
                include: [{model: Hunt},{model: Player}]
            })
            .then(function(gameplay){
                console.log(gameplay[0].dataValues.hunt);
                console.log(gameplay[0].dataValues.players);
                var game = gameplay.map(function(data){
                    return {
                        name: data.dataValues.name,
                        playStatus: data.dataValues.playStatus,
                        gameplayId: data.dataValues.id,
                        huntId: data.dataValues.hunt.dataValues.id,
                        playerId: data.dataValues.players[0].dataValues.id
                    };
                });
                res.json(game);
            });
        });
    });

    router.get('/playgame', isLoggedIn, (req, res) => {
        console.log("I was requested!");
        req.session.gameplayId = req.query.gameplayId;
        req.session.huntId = req.query.huntId;
        req.session.playerId = req.query.playerId;
        res.json({redirect:'/map'});
    });

    // Keep this for development
    router.get('/map', isLoggedIn, (req, res) => {
        res.render('map');
    });

    /* Database queries via jQuery */

    // Get player's current itinerary index (gameplay progress)
    router.get('/itineraryIndex', isLoggedIn, (req, res) => {
        Player.findOne({
            where: {id: req.session.playerId}
        })
        .then( player => {
            res.send(player.itineraryIndex.toString());
        }).catch(function(err){console.log(err);});
    });

    // Update player's itinerary index (gameplay progress)
    router.post('/itineraryIndex', isLoggedIn, (req, res) => {
        var newIndex = req.query.newIndex;
        Player.update({
            itineraryIndex: newIndex
        }, {
            where: {id: req.session.playerId}
        }).catch(function(err){console.log(err);});
    });

    // Get player's destination/task
    router.get('/itinerary', isLoggedIn, (req, res) => {
        var huntId = req.session.huntId; 
        var counter = parseInt(req.query.counter);
        if (isNaN(counter)) {
            Hunt.findOne({
                where:{id: huntId}
            })
            .then( hunt => {
                res.send((hunt.itinerary.length).toString());
            }).catch( err => console.log(err));
        } else {
            var destinationId, taskId, destination, task;
            Hunt.findOne({
                where: {id: huntId}
            })
            .then( hunt => {
                if (counter >= hunt.itinerary.length) {
                    res.redirect('/gameend');
                }
                destinationId = hunt.itinerary[counter][0];
                taskId = hunt.itinerary[counter][1];
            })
            .then(() => {
                Destination.findOne({
                    where: {id: destinationId}
                })
                .then(function(result){
                    destination = result;
                })
                .then(() => {
                    Task.findOne({
                        where: {id: taskId}
                    })
                    .then( result => {
                        task = result;
                        res.send({destination:destination, task:task});
                    });
                });
            }).catch( err => console.log(err));
        }
    });

    // Score update
    router.post('/updatescore', isLoggedIn, (req, res) => {
        var addScore = req.query.add;
        Player.findOne({where: {
            id: req.session.playerId
        }})
        .then( player => {
            Player.update({
                score: parseInt(player.score) + parseInt(addScore)
            }, {
                where: {id: req.session.playerId}
            });
        })
        .catch( err => console.log(err));
    });

    router.get('/gameend', isLoggedIn, (req, res) => {
        var ge = {
            gameplayId: req.session.gameplayId,
            huntId: req.session.huntId,
            playerId: req.session.playerId
        };
        var scores, itineraryIndices, endeds = {};
        if (req.query.gameplayId) {
            ge.gameplayId = req.query.gameplayId;
            ge.huntId = req.query.huntId;
            ge.playerId = req.query.playerId;
        }
        Player.findAll({
            where: {gameplayId: ge.gameplayId},
            include: [{model: User}]
        })
        .then(function(players){
            scores = players.map( item => {
                return {
                    userId: item.userId,
                    name: item.user.firstName + ' ' + item.user.lastName,
                    score: item.score
                };
            });
            scores = scores.sort((a, b) => {return a.score < b.score;});
            itineraryIndices = players.map(item => item.itineraryIndex);
        })
        .then(function() {
            Gameplay.findOne({
                where: {id: ge.gameplayId}
            })
            .then(function(gameplay) {
                console.log('LALALALA: ' + gameplay);
                if (gameplay.playStatus === 'ended') {
                    scores[0].winner = 'Y';
                    endeds.ended = true;
                } else if (gameplay.playStatus === 'ongoing') {
                    // If all players finished all destinations/tasks
                    Hunt.findOne({
                        id: ge.huntId
                    })
                    .then(function(hunt) {
                        var itineraryLength = hunt.itinerary.length;
                        var indexSet = new Set(itineraryIndices.map(function(index) {
                            return index >= itineraryLength;
                        }));
                        if (indexSet.size === 1 & indexSet.has(true)) {
                            Gameplay.update(
                                {playStatus: 'ended'},
                                {where:{id: ge.gameplayId}}
                            );
                            scores[0].winner = 'Y';
                            endeds.ended = true;
                        }
                    });
                }
            });
        })
        .then(function() {
            res.render('gameend', {scores: scores, endeds: endeds});
        })
        .catch(function(err) {console.log(err);});
    });

// below code is for reference only

    router.get('/error', (req, res) => {
        res.send('You fail!');
    });

    router.get('/gamemenu/:username', isLoggedIn, function(req, res) {
        User.findOne({
            where: {
                userName: req.session.passport.user   //'.user' is the default object key to access the value in passport
            }
        })
        .then(function(result){
            // console.log(result)

            res.render('user', result.dataValues)
        })
    });


    router.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/user',
        failureRedirect: '/error'
    }));

    return router;
};
