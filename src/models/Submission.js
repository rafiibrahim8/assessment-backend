'use strict';

const { Schema, model } = require('mongoose');

const sumbissionSchema = new Schema({
    assessment:{
        type: Schema.ObjectId,
        ref: 'Assessment',
        required: true
    },
    submission_type:{
        type: String,
        required: true,
        validate : (value) =>{
            return ['file', 'link'].includes(value);
        },
    },
    content:{
        type: String,
        required: true
    },
    submitted_by:{
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    },
    grade:{
        type: Schema.ObjectId,
        ref: 'Grade'
    },
    submitted_at:{
        type: Date,
        default: Date.now
    }
});

module.exports = model('Submission', sumbissionSchema);
