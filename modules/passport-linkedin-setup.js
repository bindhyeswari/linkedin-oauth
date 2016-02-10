var session = require('express-session');
var passport = require('passport');
var LinkedinStrategy = require('passport-linkedin-oauth2').Strategy;

var config = require('../config');

var LINKEDIN_CLIENT_ID = config.linkedin.client_id;
var LINKEDIN_CLIENT_SECRET = config.linkedin.client_secret;

module.exports = function (app) {

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });


    passport.use(new LinkedinStrategy({
            clientID:     LINKEDIN_CLIENT_ID,
            clientSecret: LINKEDIN_CLIENT_SECRET,
            callbackURL:  "http://localhost:3000/auth/linkedin/callback",
            scope:        [ 'r_basicprofile', 'r_emailaddress', 'w_share', 'rw_company_admin'],
            passReqToCallback: true
        },
        function(req, accessToken, refreshToken, profile, done) {
            // asynchronous verification, for effect...
            console.log(profile);
            req.session.accessToken = accessToken;
            process.nextTick(function () {
                // To keep the example simple, the user's Linkedin profile is returned to
                // represent the logged-in user.  In a typical application, you would want
                // to associate the Linkedin account with a user record in your database,
                // and return that user instead.
                return done(null, profile);
            });
        }
    ));
    // set up the session for the app
    app.use(session({
        secret: 'blueship482',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true }
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    app.get('/account', ensureAuthenticated, function(req, res){
        res.status(200).json({ user: req.user });
    });

    app.get('/auth/linkedin',
        passport.authenticate('linkedin', { state: 'SOME STATE' }),
        function(req, res){
            // The request will be redirected to Linkedin for authentication, so this
            // function will not be called.
        });

    app.get('/auth/linkedin/callback',
        passport.authenticate('linkedin', { failureRedirect: '/login' }),
        function(req, res) {
            res.redirect('/');
        });

    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });

    function ensureAuthenticated(req, res, next) {
        console.log(req.user);
        if (req.isAuthenticated()) { return next(); }
        res.status(401).json({
            message: 'You need to be authenticated to use this endpoint.'
        });
    }

};