const mongoose = require('mongoose');
const { Schema } = mongoose;

const dataSchema = new Schema({
    mass: {
        type: Number,
        index: true,
        required: true,
    },
    user: mongoose.model('User').schema,
},
    { timestamps: { createdAt: 'created_at' } });

const Data = mongoose.model('LD1', dataSchema);
module.exports = Data;