const passport = require('passport');
const path = require('path');


var adminController = function (mongoose, sockets) {
    var getAllUsers = function (req, res) {
        passport.authenticate('jwt', { session: false }, async function (err, userFound, user) {
            var userModel = mongoose.model('User');
            if (err) { return next(err); }
            // Redirect if it fails
            if (!userFound) { return res.redirect('/evidencija/login'); }
            switch (user.role) {
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
        passport.authenticate('jwt', { session: false }, async function (err, userFound, user) {
            var userModel = mongoose.model('User');

            if (err) { return next(err); }
            // Redirect if it fails
            if (!userFound) { return res.redirect('/evidencija/login'); }
            switch (user.role) {
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
        passport.authenticate('jwt', { session: false }, async function (err, userFound, user) {
            var rfidModel = mongoose.model('RFID');
            if (err) { return next(err); }
            // Redirect if it fails
            if (!userFound) { return res.redirect('/evidencija/login'); }
            switch (user.role) {
                case 'ADMIN':
                    totalRFIDs = await rfidModel.find({}, { RFID: 1, created_at: 1 });
                    rfids = await rfidModel.find({}, { RFID: 1, created_at: 1, authorised: 1 }).skip(req.body.offset).limit(req.body.limit);
                    return res.status(200).send({ rfids, count: totalRFIDs.length });
                case 'USER':
                    return res.status(401).send('unauthorised');
                default:
                    break;
            }

        })(req, res);
    };

    var deleteUser = function (req, res) {
        passport.authenticate('jwt', { session: false }, async function (err, userFound, user) {
            let userModel = mongoose.model('User');
            let rfidModel = mongoose.model('RFID');

            if (err) { return next(err); }
            // Redirect if it fails
            if (!userFound) { return res.redirect('/evidencija/login'); }
            switch (user.role) {
                case 'ADMIN':
                    if (sockets.length < 1) {
                        return res.status(400).send('Cabinet not online');
                    }
                    let userToUpdate = await userModel.findOne({ _id: req.body.id }, { _id: 1, RFID: 1 });
                    if (userToUpdate != null) {
                        if (user._id.toString() != userToUpdate._id.toString()) {
                            var updated = await userModel.findOneAndDelete({ _id: req.body.id });
                            if (updated != null) {
                                updated = await rfidModel.updateOne({ RFID: userToUpdate.RFID.RFID }, { authorised: false });
                                if (updated.n == 1) {
                                    if (userToUpdate.RFID != null) {
                                        let rfids = await rfidModel.find({ authorised: true }, { RFID: 1 });
                                        console.log(rfids);
                                        sockets[0].emit("file", rfids);
                                        //sockets[0].emit("remove", [{ RFID: userToUpdate.RFID.RFID }]);
                                    }
                                }
                            }
                            return res.status(200).send('success');
                        } else {
                            return res.status(400).send('You cannot delete your own user!');
                        }
                    } else {
                        return res.status(400).send('No such user');
                    }
                case 'USER':
                    return res.status(401).send('unauthorised');
                default:
                    break;
            }

        })(req, res);
    };

    var deleteRFID = function (req, res) {
        passport.authenticate('jwt', { session: false }, async function (err, userFound, user) {
            let userModel = mongoose.model('User');
            let rfidModel = mongoose.model('RFID');

            if (err) { return next(err); }
            if (!userFound) { return res.redirect('/evidencija/login'); }
            switch (user.role) {
                case 'ADMIN':
                    console.log()
                    if (sockets.length < 1) {
                        return res.status(400).send('Cabinet not online');
                    }
                    let rfid = await rfidModel.findOne({ _id: req.body.id }, { _id: 1, RFID: 1, created_at: 1 });
                    if (rfid != null) {
                        var updated = await rfidModel.findOneAndDelete({ _id: req.body.id });
                        if (updated != null) {
                            var updated = await userModel.findOneAndUpdate({ "RFID.RFID": rfid.RFID }, { RFID: null });
                            if (updated != null) {

                                let rfids = await rfidModel.find({ authorised: true }, { RFID: 1 });
                                console.log(rfids);
                                sockets[0].emit("file", rfids);
                                //sockets[0].emit("remove", [{ RFID: rfid.RFID }]);
                            }
                        }

                        return res.status(200).send('success');
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

    var updateUserID = function (req, res) {
        passport.authenticate('jwt', { session: false }, async function (err, userFound, user) {
            let userModel = mongoose.model('User');
            let rfidModel = mongoose.model('RFID');

            if (err) { return next(err); }
            // Redirect if it fails
            if (!userFound) { return res.redirect('/evidencija/login'); }
            switch (user.role) {
                case 'ADMIN':
                    if (sockets.length < 1) {
                        return res.status(400).send('Cabinet not online');
                    }
                    let rfid = await rfidModel.findOne({ RFID: req.body.rfid }, { _id: 1, RFID: 1, created_at: 1 });
                    let userToUpdate = await userModel.findOne({ _id: req.body.id }, { _id: 1, RFID: 1, created_at: 1 });
                    if (rfid != null) {

                        var updated = await userModel.updateOne({ _id: req.body.id }, { RFID: rfid });
                        if (updated.n == 1) {
                            updated = await rfidModel.updateOne({ RFID: rfid.RFID }, { authorised: true });
                            if (updated.n == 1) {
                                // if (userToUpdate.RFID != null) {
                                //     let rfids = await rfidModel.find({ authorised: true }, { RFID: 1 });
                                //     console.log(rfids);
                                //     sockets[0].emit("update", [{ oldRFID: userToUpdate.RFID.RFID, RFID: rfid.RFID }]);
                                // } else {
                                //     sockets[0].emit("add", [{ RFID: rfid.RFID }]);
                                // }

                                let rfids = await rfidModel.find({ authorised: true }, { RFID: 1 });
                                sockets[0].emit("file", rfids);
                            }

                        }
                        return res.status(200).send('success');
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
        updateUserID: updateUserID,
        deleteRFID: deleteRFID,
        deleteUser: deleteUser
    };
};



module.exports = adminController;