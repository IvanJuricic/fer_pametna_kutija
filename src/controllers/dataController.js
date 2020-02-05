var dataController = function (mongoose) {
    var getChanges = async function (req, res) {
        var LD1Model = mongoose.model('LD1');
        var LD2Model = mongoose.model('LD2');
        console.log("hio")
        data1 = await LD1Model.find({}, { user: 1, created_at: 1, mass: 1 }).sort({ created_at: -1 }).limit(req.body.limit);
        data2 = await LD2Model.find({}, { user: 1, created_at: 1, mass: 1 }).sort({ created_at: -1 }).limit(req.body.limit);
        return res.status(200).send({ data1: data1, data2: data2 });
    };

    return {
        getChanges: getChanges
    };
};

module.exports = dataController;