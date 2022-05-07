'use strict';

const mongoose = require("mongoose");

const gradeSchema = new mongoose.Schema({
    mark:{
        type: Number,
        required: true
    },
    remarks:{
        type: String
    }
});

module.exports = mongoose.model('Grade', gradeSchema);
