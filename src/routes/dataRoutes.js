var express = require('express');
var dataRouter = express.Router();
var router = function (mongoose) {
    var dataController = require('../controllers/dataController')(mongoose);
    dataRouter.route('/getChanges')
        .post(dataController.getChanges);
    return dataRouter;
};

module.exports = router;