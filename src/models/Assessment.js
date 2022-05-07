'use strict';

const { Schema, model } = require('mongoose');

let assessmentSchema = new Schema({
    title:{
        type: String,
        required: true,
        trim: true
    },
    description:{
        type: String
    },
    mentor:{
        type: Schema.ObjectId,
        required: true,
        ref: 'User'
    },
    created_at:{
        type: Date,
        default: Date.now
    },
    deadline:{
        type: Date,
        required: true,
        validate: (value)=>{
            return Date.now() < value;
        }
    },
});

module.exports = model('Assessment', assessmentSchema);
