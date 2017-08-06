//router.js
const passport = require('passport');
// const Model = require('./models');
// const User = Model.trackMyFriends


module.exports = (express) => {
    const router = express.Router();

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

    router.get('/gamemenu', (req, res) => {
        res.render('gamemenu')
    });

    router.get('/gamesetup', (req, res) => {
        res.render('gamesetup')
    });

// below code is for reference only

    router.get('/error', (req, res) => {
        res.send('You fail!');
    });

    router.get('/gamemenu/:username', function(req, res) {
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

    // router.post('/signup', function(req, res){
    //     console.log('data is' + req.body.password)
    //     var createUserName = req.body.username //data is in an object --- '.createUserName is name we labled in the form->input'
    //     var createPassword = req.body.password
    //     var registerFirstName = req.body.firstName
    //     var registerLastName = req.body.lastName
    //     bcrypt.hashPassword(createPassword)
    //         .then(hash => {
    //             password: hash
    //         })
    //         User.create({
    //             userName: createUserName,
    //             Password: createPassword,
    //             firstName: registerFirstName,
    //             lastName: registerLastName
    //         })
    //     .then(function (result) {
    //         req.login(result, function(err){
    //             if (err) {
    //                 console.log(err)
    //                 res.redirect ('/error')
    //             }
    //             return res.redirect ('/user/' + result.username)
    //         })
    //     })
    //     .catch(function (err) {
    //         console.log('Account failed to create ' + err)
    //     })
    // });

    return router;
};
