
var express = require('express');
var adminRouter = express.Router();

var router = function (mongoose, sockets) {
    var adminController = require('../controllers/adminController')(mongoose, sockets);
    adminRouter.route('/getAllUsers')
        .get(adminController.getAllUsers);
    adminRouter.route('/getUsers')
        .post(adminController.getUsers);
    adminRouter.route('/getAllRFIDs')
        .post(adminController.getAllRFIDs);
    adminRouter.route('/updateUserID')
        .post(adminController.updateUserID);
    adminRouter.route('/deleteRFID')
        .post(adminController.deleteRFID);
    adminRouter.route('/deleteUser')
        .post(adminController.deleteUser);
    return adminRouter;
};

module.exports = router;