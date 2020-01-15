const mongoose = require('mongoose');
const { Schema } = mongoose;

const RFIDSchema = new Schema({
    RFID: {
        type: String,
        unique: true,
        dropDups: true,
        required: true,
    },
}, { timestamps: { createdAt: 'created_at' } });

const RFID = mongoose.model('RFID', RFIDSchema);
module.exports = RFID;