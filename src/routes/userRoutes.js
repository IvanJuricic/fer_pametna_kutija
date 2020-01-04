
var express = require('express');
var userRouter = express.Router();
var userController = require('../controllers/userController')();

var router = function () {
    userRouter.route('/')
        .get(userController.getUser);
    userRouter.route('/logout')
        .get(userController.getLogout);
    return userRouter;
};

module.exports = router;