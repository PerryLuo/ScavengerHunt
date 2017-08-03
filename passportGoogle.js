//passportGoogle.js
const passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;

// const Model = require('./models');
// const User = Model.trackMyFriends;
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
            User.findOne({
                googleId: profile.id
            },
            function (err, user) {
                return cb(err, user);
            });
        }
    ));


}
