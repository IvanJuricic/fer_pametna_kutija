const mongoose = require('mongoose');
const validator = require('validator');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    index: true,
    unique: true,
    dropDups: true,
    required: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is invalid')
      }
    }
  },
  passwordHash: { //salted and hashed using bcrypt
    type: String,
    required: true,
  },
  // email: {
  //     type: String,
  //     required: true,
  //     trim: true,
  //     validate(value){
  //         if(!validator.isEmail(value)){
  //             throw new Error('Email is invalid')
  //         }
  //     }
  // },
  role: {
    type: String,
    enum: ['ADMIN', 'USER'],
    default: 'USER',
  },
  RFID: mongoose.model('RFID').schema,
});

const User = mongoose.model('User', userSchema);
module.exports = User;