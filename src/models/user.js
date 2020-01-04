const mongoose = require('mongoose')
const validator = require('validator')

const User = mongoose.model('User',{
    username: {
        type: String,
        required: true,
        trim: true
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
    password:{
        type: String,
        required: true,
        trim: true
        //minlength: 7
    }
})

module.exports = User