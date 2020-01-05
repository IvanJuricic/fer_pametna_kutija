var passport = require('passport');
const UserModel = require('../models/user');
const keys = require('./keys');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const bcrypt = require('bcrypt');
const JWTStrategy = passportJWT.Strategy;

var cookieExtractor = function (req) {
    var token = null;
    console.log(req.cookies);
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
            const passwordsMatch = await bcrypt.compare(password, userDocument.passwordHash);

            if (passwordsMatch) {
                console.log(userDocument)
                console.log("userDocument")
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
            console.log(jwtPayload);
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