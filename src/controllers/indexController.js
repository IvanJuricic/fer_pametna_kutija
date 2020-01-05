
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
        const { username, password } = req.body;

        // authentication will take approximately 13 seconds
        // https://pthree.org/wp-content/uploads/2016/06/bcrypt.png
        const hashCost = 10;

        try {
            const passwordHash = await bcrypt.hash(password, hashCost);
            const userDocument = new UserModel({ username, passwordHash });
            await userDocument.save();

            res.redirect('/login');

        } catch (error) {
            res.status(400).send({
                error: 'req body should take the form { username, password }',
            });
        }
    };

    var getLogin = function (req, res) {
        res.sendFile(path.join(__dirname, '/../views/login.html'));
    };

    var postLogin = function (req, res) {
        const { username, password } = req.body;
        passport.authenticate(
            'local',
            { session: false },
            (error, user) => {
                if (error || !user) {
                    console.log(error);
                    res.redirect('/login');
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
                    return res.redirect('/user');
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