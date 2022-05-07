'use strict';

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        sparse: true,
        index: true,
        validate: [
            (value)=>{
                return /^[0-9a-z_]+$/.test(value);
            },
            'username can only contain lowercase letters, numbers and underscore.'
        ]
    },
    full_name:{
        type: String,
        trim: true
    },
    email:{
        type: String,
        validate: (value)=>{
            return String(value).toLowerCase().match(
                // Shamelessly copied regexp from: https://stackoverflow.com/posts/46181/revisions
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
              );
          }
    },
    password:{
        type: String,
        required: true,
        validate:[
            (value)=>{
                return value.length >= 8;
            },
            'Password must be at least 8 character long.'
        ]
    },
    role:{
        type: String,
        validate : (value) =>{
            return ['student', 'mentor', 'admin'].includes(value);
        },
        required: true
    },
    active:{
        type: Boolean,
        default: true
    },
    logged_in:{
        type: Boolean,
        default: false
    },
    random:{
        type: String,
        default: ''
    }
});

userSchema.methods.getJWT = function(random){
    let random_ = random ? random: this.random;
    return jsonwebtoken.sign({username: this.username, random: random_}, process.env.JWT_SECRET);
};

userSchema.methods.checkPasswd = function(passwd){
    return bcrypt.compareSync(passwd, this.password);
};

userSchema.pre('save', function(next){
    let salt = bcrypt.genSaltSync();
    this.password = bcrypt.hashSync(this.password, salt);
    next();
});

module.exports = mongoose.model('User', userSchema);
