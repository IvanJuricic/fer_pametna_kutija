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

            if (err) { return next(err); }
            // Redirect if it fails
            if (!user) { return res.redirect('/login'); }
            switch (role) {
                case 'ADMIN':
                    totalUsers = await userModel.find({}, {});
                    users = await userModel.find({}, { username: 1, role: 1, RFID: 1 }).skip(req.body.offset).limit(req.body.limit);
                    return res.status(200).send({ users, count: totalUsers.length });
                case 'USER':
                    return res.status(401).send('unauthorised');
                default:
                    break;
            }

        })(req, res);
    };

    var getAllRFIDs = function (req, res) {
        passport.authenticate('jwt', { session: false }, async function (err, user, role) {
            var rfidModel = mongoose.model('RFID');
            if (err) { return next(err); }
            // Redirect if it fails
            if (!user) { return res.redirect('/login'); }
            switch (role) {
                case 'ADMIN':
                    totalRFIDs = await rfidModel.find({}, { RFID: 1, created_at: 1 });
                    rfids = await rfidModel.find({}, { RFID: 1, created_at: 1 }).skip(req.body.offset).limit(req.body.limit);
                    return res.status(200).send({ rfids, count: totalRFIDs.length });
                case 'USER':
                    return res.status(401).send('unauthorised');
                default:
                    break;
            }

        })(req, res);
    };

    var updateUserID = function (req, res) {
        passport.authenticate('jwt', { session: false }, async function (err, user, role) {
            var userModel = mongoose.model('User');
            var rfidModel = mongoose.model('RFID');

            if (err) { return next(err); }
            // Redirect if it fails
            if (!user) { return res.redirect('/login'); }
            switch (role) {
                case 'ADMIN':
                    var rfid = await rfidModel.findOne({ RFID: req.body.rfid }, { _id: 1, RFID: 1, created_at: 1 });
                    console.log(rfid);
                    if (rfid != null) {

                        var updated = await userModel.updateOne({ _id: req.body.id }, { RFID: rfid });
                        return res.redirect('/user');
                    } else {
                        return res.status(400).send('No such RFID');
                    }
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
        updateUserID: updateUserID
    };
};



module.exports = adminController;