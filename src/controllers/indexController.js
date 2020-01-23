
const UserModel = require('../models/user');
var passport = require('passport');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const path = require('path');

var indexController = function () {
    var getRegister = function (req, res) {
        res.sendFile(path.join(__dirname, '/../views/register.html'));
    };

    var postRegister = async function (req, res) {


        passport.authenticate('jwt', { session: false }, async function (err, userFound, user) {
            if (err) { return next(err); }
            // Redirect if it fails
            if (!userFound) { return res.redirect('/login'); }
            switch (user.role) {
                case 'ADMIN':
                    const { username, password } = req.body;

                    // authentication will take approximately 13 seconds
                    // https://pthree.org/wp-content/uploads/2016/06/bcrypt.png
                    const hashCost = 10;

                    try {
                        const passwordHash = await bcrypt.hash(password, hashCost);
                        const userDocument = new UserModel({ username, passwordHash });
                        await userDocument.save();

                        return res.status(200).send('success');

                    } catch (error) {
                        console.log(error)
                        return res.status(400).send({
                            error: error.errmsg,
                        });
                    }
                case 'USER':
                    return res.status(401).send('unauthorised');
                default:
                    break;
            }

        })(req, res);

    };

    var getLogin = function (req, res) {
        res.sendFile(path.join(__dirname, '/../views/login.html'));
    };

    var postLogin = function (req, res) {
        passport.authenticate(
            'local',
            { session: false },
            (error, user) => {
                if (error) {
                     res.status(400).send({ error });;
                     return;
                }
                if (!user) {
                    res.status(400).send("Wrong username or password");
                    return;
                }
                const payload = {
                    username: user.username,
                    expires: Date.now() + 10000000,
                };

                /** assigns payload to req.user */
                req.login(payload, { session: false }, (error) => {
                    if (error) {
                        res.status(400).send({ error });
                        return;
                    }

                    /** generate a signed json web token and return it in the response */
                    const token = jwt.sign(JSON.stringify(payload), keys.secret);

                    /** assign our jwt to the cookie */
                    res.cookie('jwt', token, { httpOnly: true, secure: true });
                    return res.status(200).send("authenticated");
                });
            },
        )(req, res);
    };

    var getIndex = function (req, res) {
        res.sendFile(path.join(__dirname, '/../views/index.html'));
    };

    return {
        postLogin: postLogin,
        getLogin: getLogin,
        postRegister: postRegister,
        getRegister: getRegister,
        getIndex: getIndex,
    };
};

module.exports = indexController;