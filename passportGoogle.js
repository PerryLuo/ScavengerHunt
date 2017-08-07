//passportGoogle.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('./models').user;

module.exports = (app) => {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new GoogleStrategy({
        clientID: ' ',
        clientSecret: ' ',
        callbackURL: "http://.../auth/google/googletoken"
    }, function(accessToken, refreshToken, profile, cb) {
        console.log(profile);
        // User.findOrCreate({
        //     googleId: profile.id // HL: should change this to `email: ...`
        // },
        // function(err, user) {
        //     return cb(err, user);
        // });
    }));

    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => {
        User.findOne({where: {'id': id}})
            .then(user => {
                if (user === null) done(new Error('Wrong user id.'));
                done(null, user);
            });
    });
};
