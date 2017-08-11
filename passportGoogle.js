//passportGoogle.js
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('./models').user;

module.exports = (app) => {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new GoogleStrategy({
        clientID: '228636638343-iamabdia4r5rj2ahfnb3nm0upe92rpqa.apps.googleusercontent.com',
        clientSecret: 'SZib7Cs_6uRlvTjIGBbefLhh',
        callbackURL: "http://cee4441f.ngrok.io/auth/google/googletoken"
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
