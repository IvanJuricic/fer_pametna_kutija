const passport = require('passport');
const path = require('path');


var adminController = function (mongoose) {
    var getAllUsers = function (req, res) {
        passport.authenticate('jwt', { session: false }, async function (err, user, role) {
            var userModel = mongoose.model('User');
            if (err) { return next(err); }
            // Redirect if it fails
            if (!user) { return res.redirect('/login'); }
            switch (role) {
                case 'ADMIN':
                    users = await userModel.find({}, { username: 1, role: 1, RFID: 1 });
                    return res.status(200).send(users);
                case 'USER':
                    return res.status(401).send('unauthorised');
                default:
                    break;
            }

        })(req, res);
    };

    var getUsers = function (req, res) {
        passport.authenticate('jwt', { session: false }, async function (err, user, role) {
            var userModel = mongoose.model('User');

            console.log(req.body.limit);
            if (err) { return next(err); }
            // Redirect if it fails
            if (!user) { return res.redirect('/login'); }
            switch (role) {
                case 'ADMIN':
                    totalusers = await userModel.find({}, { username: 1, role: 1, RFID: 1 });
                    users = await userModel.find({}, { username: 1, role: 1, RFID: 1 }).skip(req.body.offset).limit(req.body.limit);
                    return res.status(200).send({ users, count: totalusers.length });
                case 'USER':
                    return res.status(401).send('unauthorised');
                default:
                    break;
            }

        })(req, res);
    };

    var getAllRFIDs = function (req, res) {
        passport.authenticate('jwt', { session: false }, async function (err, user, role) {
            var userModel = mongoose.model('RFID');
            if (err) { return next(err); }
            // Redirect if it fails
            if (!user) { return res.redirect('/login'); }
            switch (role) {
                case 'ADMIN':
                    users = await userModel.find({}, { RFID: 1, created_at: 1 }).skip(req.offset).limit(req.query);
                    return res.status(200).send(users);
                case 'USER':
                    return res.status(401).send('unauthorised');
                default:
                    break;
            }

        })(req, res);
    };

    return {
        getAllUsers: getAllUsers,
        getUsers: getUsers,
        getAllRFIDs: getAllRFIDs,
    };
};



module.exports = adminController;