const passport = require('passport');
const path = require('path');


var userController = function () {
    var getUser = function (req, res) {
        passport.authenticate('jwt', { session: false }, function (err, user, role) {
            if (err) { res.redirect('/login'); }
            // Redirect if it fails
            if (!user) { return res.redirect('/login'); }
            switch (role) {
                case 'ADMIN':
                    return res.sendFile(path.join(__dirname, '/../views/admin.html'));
                case 'USER':
                    return res.sendFile(path.join(__dirname, '/../views/user.html'));
                default:
                    break;
            }

        })(req, res);
    };

    var getLogout = function (req, res) {
        req.logout();
        res.redirect('/');
    };

    return {
        getUser: getUser,
        getLogout: getLogout,
    };
};



module.exports = userController;