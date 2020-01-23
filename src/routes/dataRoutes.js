var express = require('express');
var dataRouter = express.Router();
var dataController = require('../controllers/dataController')();

var router = function () {
    dataRouter.route('/getAllChanges')
        .get(dataController.getAllChanges);
    return dataRouter;
};

module.exports = router;