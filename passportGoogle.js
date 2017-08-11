//passportGoogle.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('./models').user;

module.exports = (app) => {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new GoogleStrategy({
        clientID: '530099490791-e13gnvdek6bv6ftlcovuga493jrnrso2.apps.googleusercontent.com',
        clientSecret: 'z-xgz8YLUoKjgk7E2M98HSyb',
        callbackURL: "http://128.199.67.112.xip.io/auth/google/googletoken"
    }, function(accessToken, refreshToken, profile, cb) {
        User.findOrCreate({
            where:{googleId:profile.id}
        })
        .then( user => cb(null, user));
    }));

    passport.serializeUser((user, done) => done(null, user[0].id));

    passport.deserializeUser((id, done) => {
        User.findOne({
            where: {'id': id}
        })
        .then(user => {
            if (user === null) done(new Error('Wrong user id.'));
            done(null, user);
        });
    });
};
