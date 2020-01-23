const DataModel = require('../models/data');
const path = require('path');

var dataController = function () {
    var getWeight = async function (req, res) {
        var dataModel = mongoose.model('Data');

        data = await dataModel.find({},{ user: 1, created_at: 1, mass: 1});
        return res.status(200).send({ data });
        console.log(data);
    };

    return {
        getWeight : getWeight
    };
};

module.exports = dataController;