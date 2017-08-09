//router.js
const passport = require('passport');
const client = require('./redis')
const User = require('./models').user;
const Hunt = require('./models').hunt;
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
        res.render('map')
    });

    // Keep this for development
    router.get('/map', (req, res) => {
        res.render('map');
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
