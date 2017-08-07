//passportGoogle.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('./models').user;
const bcrypt = require('./bcrypt');

module.exports = (app) => {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new GoogleStrategy({
        clientID: '121718160890-mefo9636o4dcd3ova9h3h6kl2ujd35rk.apps.googleusercontent.com',
        clientSecret: 'JCS_ptZY7pia25QJ8SVgraPK',
        callbackURL: "http://127.0.0.1:8080/auth/google/googletoken"
        },
        function(accessToken, refreshToken, profile, cb) {
            User.findOrCreate({
                googleId: profile.id // HL: should change this to `email: ...`
            },
            function (err, user) {
                return cb(err, user);
            });
        }
    ));

    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => {
        User.findOne({where: {'id': id}})
            .then(user => {
                if (user === null) done(new Error('Wrong user id.'));
                done(null, user);
            });
    });
};
