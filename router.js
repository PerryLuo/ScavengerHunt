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
        var filename = req.params.file;
        res.sendFile(__dirname + '/js/' + filename);
    });
    router.get('/public/css/main.css', (req, res) => {
        res.sendFile(__dirname + '/css/main.css');
    });
    router.get('/public/art/:file', (req, res) => {
        var filename = req.params.file;
        res.sendFile(__dirname + '/art/' + filename);
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
        res.render('gamemenu')
    });

    router.get('/gamesetup', isLoggedIn, (req, res) => {
        res.render('gamesetup')
    });

    router.post('/chosenhunt', isLoggedIn, (req, res) => {
        Hunt.findOne({
            where:{
                id: req.body.hunt
            }
        })
        .then(function(hunt){
            Gameplay.create({
                name: req.body.gamename,
                huntId: req.body.hunt,
                organizerId: req.session.passport.user
            })
            .then(function (gameData) {
                Player.create({
                    userId: req.session.passport.user,
                    gameplayId: gameData.dataValues.id
                })
                res.json({redirect:'/playgame'})
                // console.log(req.session.passport.user)
                // client.set('game-'+gameData.dataValues.id, JSON.stringify(hunt),function(err, data){
                //     if(err){
                //         return console.log(err)
                //     }
                //     res.end()
                // })
            })
        })
    });

    router.post('/joingame', isLoggedIn, (req, res, next) => {
        Gameplay.findOne({
            where:{
                id: req.body.joingame
            }
        })
        .then(function(gameData){
            if (!gameData) {
                res.json({redirect:'/error'})
            }
            else {
                res.json({redirect:'/playgame'})
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
        })
        // .catch(function(err){
        //     res.redirect('/error')
        // })
    })

    router.get('/playgame', isLoggedIn, (req, res) => {
        // client.set(req.)
        res.render('map')
    });

    // Keep this for development
    router.get('/map', (req, res) => {
        Hunt.findOne({where:{id:1}})
            .then(function(hunt){
                res.render('map', {hunt: {huntId: hunt.id}});
            });
    });

    // Database queries via jQuery
    router.get('/itinerary', function(req, res) {
        var huntId = req.query.id;
        var counter = parseInt(req.query.counter);
        if (isNaN(counter)) {
            Hunt.findOne({where:{id: huntId}})
                .then(function(hunt){
                    res.send((hunt.itinerary.length).toString());
                }).catch(function(err){console.log(err);});
        } else {
            var destinationId, taskId, destination, task;
            Hunt.findOne({where:{id: huntId}})
                .then(function(hunt){
                    destinationId = hunt.itinerary[counter][0];
                    taskId = hunt.itinerary[counter][1];
                })
                .then(function() {
                    Destination.findOne({where: {id: destinationId}})
                        .then(function(result){
                            destination = result;
                        })
                        .then(function() {
                            Task.findOne({where: {id: taskId}})
                                .then(function(result){
                                    task = result;
                                    res.send({destination:destination, task:task});
                                });
                        });
                })
                .catch(function(err){console.log(err);});
        }
    });

    // Score update
    router.post('/updatescore', function(req, res){
        var addScore = req.query.add;
        Player.findOne({where: {
            gameplayId: '1', // NOTE: Need to change this into a variable
            userId: '1' // NOTE: Need to change this into a variable
        }})
        .then(function(player){
            Player.update({
                score: parseInt(player.score) + parseInt(addScore)
            }, {
                where:{
                    gameplayId: '1', // NOTE: Need to change this into a variable
                    userId: '1' // NOTE: Need to change this into a variable
                }
            });
        })
        .catch(function(err){console.log(err);});
    });

    router.get('/gameend', (req, res) => {
        var score;
        Player.findAll({
            where: {
                gameplayId: '1', // NOTE: Need to change this into a variable
            },
            include: [{
                model: User
            }]
        })
        .then(function(players){
            var player = [], others = [];
            // HERMAN STILL WORKING ON THIS
            // others = players.forEach(function(item){
            //     if (item.userId !== req.session.passport.user) {
            //         others.push({});
            //     } else {
            //         player.push(item);
            //     }
            // });
            res.send(players);
        })
        // .then(function() {
        //     Player.findAll(Pwhere: {
        //
        //     })
        //     res.render('gameend', {player: {score:score}, others: {}});
        // })
        .catch(function(err){console.log(err);});
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
