const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    index: true,
    unique: true,
    dropDups: true,
    required: true,
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
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;