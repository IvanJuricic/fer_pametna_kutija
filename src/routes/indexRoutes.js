
var express = require('express');
var indexRouter = express.Router();
var passport = require('passport');
var indexController = require('../controllers/indexController')();

var router = function () {
    indexRouter.route('/register')
        .get(indexController.getRegister);
    indexRouter.route('/register')
        .post(indexController.postRegister);
    indexRouter.route('/login')
        .get(indexController.getLogin);
    indexRouter.route('/login')
        .post(indexController.postLogin);
    indexRouter.route('/')
        .get(indexController.getIndex);
    return indexRouter;
};

module.exports = router;