const mongoose = require('mongoose')

module.exports = function () {
    mongoose.connect('mongodb://127.0.0.1:27017/fer-smart-box-api', {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    });
    return mongoose;

}
