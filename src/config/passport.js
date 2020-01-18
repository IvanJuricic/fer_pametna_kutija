var passport = require('passport');
const UserModel = require('../models/user');
const keys = require('./keys');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const bcrypt = require('bcrypt');
const JWTStrategy = passportJWT.Strategy;

var cookieExtractor = function (req) {
    var token = null;
    if (req && req.cookies) {
        token = req.cookies['jwt'];
    }
    return token;
};

module.exports = function (app) {

    app.use(passport.initialize());
    app.use(passport.session());


    passport.use(new LocalStrategy(async (username, password, done) => {
        try {
            const userDocument = await UserModel.findOne({ username: username }).exec();
            if (userDocument == null)
                return done('Incorrect Username / Password');
            const passwordsMatch = await bcrypt.compare(password, userDocument.passwordHash);

            if (passwordsMatch) {
                return done(null, userDocument);
            } else {
                return done('Incorrect Username / Password');
            }
        } catch (error) {
            done(error);
        }
    }));

    passport.use(new JWTStrategy({
        jwtFromRequest: req => cookieExtractor(req),
        secretOrKey: keys.secret,
    },
        async (jwtPayload, done) => {
            if (Date.now() > jwtPayload.expires) {
                return done('jwt expired');
            }
            const userDocument = await UserModel.findOne({ username: jwtPayload.username }).exec();
            return done(null, jwtPayload, userDocument.role);
        }
    ));



























    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });
};