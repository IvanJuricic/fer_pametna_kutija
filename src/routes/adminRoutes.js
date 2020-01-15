
var express = require('express');
var adminRouter = express.Router();

var router = function (mongoose) {
    var adminController = require('../controllers/adminController')(mongoose);
    adminRouter.route('/getAllUsers')
        .get(adminController.getAllUsers);
    adminRouter.route('/getUsers')
        .post(adminController.getUsers);
    adminRouter.route('/getAllRFIDs')
        .get(adminController.getAllRFIDs);
    return adminRouter;
};

module.exports = router;