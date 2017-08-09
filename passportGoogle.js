//passportGoogle.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('./models').user;

module.exports = (app) => {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new GoogleStrategy({
        clientID: '121718160890-mefo9636o4dcd3ova9h3h6kl2ujd35rk.apps.googleusercontent.com',
        clientSecret: 'JCS_ptZY7pia25QJ8SVgraPK',
        callbackURL: "http://7bbb3953.ngrok.io/auth/google/googletoken"
    }, function(accessToken, refreshToken, profile, cb) {
        // console.log(profile);
        User.findOrCreate({where:{email:profile.id}
            // email: profile.id // HL: should change this to `email: ...`
        })
        .then(
            function(user) {
                return cb(null, user);
            });
    }));

    passport.serializeUser((user, done) => {
        // console.log('this is console log' + user[0])
        done(null, user[0].id)});
    passport.deserializeUser((id, done) => {
        User.findOne({where: {'id': id}})
            .then(user => {
                if (user === null) done(new Error('Wrong user id.'));
                done(null, user);
            });
    });
};
