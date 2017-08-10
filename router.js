//router.js
const passport = require('passport');
const client = require('./redis')
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

    router.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

    router.get('/auth/google/googletoken',
        passport.authenticate('google', { failureRedirect: '/login' }),
        function(req, res) {
            // Successful authentication, redirect home.
            res.redirect('/gamemenu');
      });

    router.get('/gamemenu', isLoggedIn, (req, res) => {
        res.render('gamemenu');
    });

    router.get('/gamesetup', isLoggedIn, (req, res) => {
        res.render('gamesetup');
    });

    router.post('/chosenhunt', isLoggedIn, (req, res) => {
        Hunt.findOne({
            where:{
                id: req.body.hunt
            }
        })
        .then( hunt => {
            req.session.huntId = hunt.id; // Save huntId to session
            Gameplay.create({
                name: req.body.gamename,
                huntId: req.body.hunt,
                organizerId: req.session.passport.user,
                playStatus: 'ongoing'
            })
            .then( gameData => {
                req.session.gameplayId = gameData.dataValues.id;  // Save gameplayId to session
                Player.create({
                    userId: req.session.passport.user,
                    gameplayId: gameData.dataValues.id,
                    score: 0,
                    itineraryIndex: 0
                }).then( playerData => {
                    req.session.playerId = playerData.dataValues.id; // Save playerId to session
                    res.json({redirect:'/playgame'});
                });
                // console.log(req.session.passport.user)
                // client.set('game-'+gameData.dataValues.id, JSON.stringify(hunt),function(err, data){
                //     if(err){
                //         return console.log(err)
                //     }
                //     res.end()
                // })
            });
        }).catch(err => console.log(err));
    });

    router.post('/joingame', isLoggedIn, (req, res, next) => {
        Gameplay.findOne({
            where:{
                id: req.body.joingame
            }
        })
        .then(function(gameData){
            if (!gameData || gameData.dataValues.playStatus !== 'ongoing') {
                res.json({redirect:'/error'});
            }
            else if (gameData.dataValues.playStatus !== 'ended') {
                Player.create({
                    userId: req.session.passport.user,
                    gameplayId: gameData.dataValues.id,
                    score: 0,
                    itineraryIndex: 0,
                });
                res.json({redirect:'/playgame'});
            }
            // res.redirect('/playgame')
            // client.get('game-'+gameData.dataValues.id, function(err, data){
            //     if(err){
            //         Hunt.findOne({
            //             where:{
            //                 id: gameData.dataValues.huntId
            //             }
            //         })
            //         .then(function (hunt) {
            //             // console.log(req.session.passport.user)
            //             client.set('game-'+gameData.dataValues.id, JSON.stringify(hunt),function(err, data){
            //                 if(err){
            //                     return console.log(err)
            //                 }
            //                 res.redirect('/playgame')
            //             })
            //         })
            //     }
            //     res.redirect('/playgame')
            // })
        });
        // .catch(function(err){
        //     res.redirect('/error')
        // })
    });

    router.get('/playgame', isLoggedIn, (req, res) => {
        // client.set(req.)
        res.render('map')
    });

    // Keep this for development
    router.get('/map', (req, res) => {
        //console.log(req.session);
        Hunt.findOne({where:{id: req.session.huntId}})
            .then( hunt => {
                res.render('map', {hunt: {huntId: hunt.id}});
            });
    });

    /* Database queries via jQuery */

    // Get player's current itinerary index (gameplay progress)
    router.get('/itineraryIndex', (req, res) => {
        Player.findOne({where: {
            id: req.session.playerId
        }})
        .then( player => {
            res.send(player.itineraryIndex.toString());
        }).catch(function(err){console.log(err);});
    });

    // Update player's itinerary index (gameplay progress)
    router.post('/itineraryIndex', (req, res) => {
        var newIndex = req.query.newIndex;
        Player.update({
            itineraryIndex: newIndex
        },{
            where: {id: req.session.playerId}
        })
        .catch(function(err){console.log(err);});
    });

    // Get player's destination/task
    router.get('/itinerary', (req, res) => {
        var huntId = req.session.huntId; // NOTE: Replace with req.session.huntId
        var counter = parseInt(req.query.counter);
        if (isNaN(counter)) {
            Hunt.findOne({where:{id: huntId}})
                .then( hunt => {
                    res.send((hunt.itinerary.length).toString());
                }).catch(function(err){console.log(err);});
        } else {
            var destinationId, taskId, destination, task;
            Hunt.findOne({where:{id: huntId}})
                .then( hunt => {
                    destinationId = hunt.itinerary[counter][0];
                    taskId = hunt.itinerary[counter][1];
                })
                .then(() => {
                    Destination.findOne({where: {id: destinationId}})
                        .then(function(result){
                            destination = result;
                        })
                        .then(() => {
                            Task.findOne({where: {id: taskId}})
                                .then(function(result){
                                    task = result;
                                    res.send({destination:destination, task:task});
                                });
                        });
                })
                .catch( err => console.log(err));
        }
    });

    // Score update
    router.post('/updatescore', (req, res) => {
        var addScore = req.query.add;
        Player.findOne({where: {
            id: req.session.playerId
            // gameplayId: '1', // NOTE: Replace with req.session.gameplayId
            // userId: '1' // NOTE: Replace with req.session.userId
        }})
        .then( player => {
            Player.update({
                score: parseInt(player.score) + parseInt(addScore)
            }, {
                where:{
                    id: req.session.playerId
                    // gameplayId: '1', // NOTE: Need to change this into a variable
                    // userId: '1' // NOTE: Need to change this into a variable
                }
            });
        })
        .catch( err => console.log(err));
    });

    router.get('/gameend', (req, res) => {
        req.session.gameplayId = 1; // testing only; delete this when deploying
        var scores, itineraryIndices, ended = false;
        Player.findAll({
            where: {gameplayId: req.session.gameplayId},
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
        .then(() => {
            Gameplay.findOne({where:{id: req.session.gameplayId}})
                .then( gameplay => {
                    if (gameplay.playStatus === 'ended') {
                        scores[0].winner = 'Y';
                        ended = true;
                    } else if (gameplay.playStatus === 'ongoing') {
                        // If all players finished all destinations/tasks
                        Hunt.findOne({id: req.session.huntId})
                            .then( hunt => {
                                var itineraryLength = hunt.itinerary.length;
                                var indexSet = new Set(itineraryIndices.map(index => {
                                    return index >= itineraryLength;
                                }));
                                if (indexSet.size === 1 & indexSet.has(true)) {
                                    Gameplay.update(
                                        {playStatus: 'ended'},
                                        {where:{id: req.session.gameplayId}}
                                    );
                                    scores[0].winner = 'Y';
                                    ended = true;
                                }
                            });
                    }
                });
        })
        .then(() => {
            //scores[0].winner = 'Y'; // delete this later
            res.render('gameend', {scores: scores, endeds: [{ended: ended}]});
        })
        .catch( err => console.log(err));
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
