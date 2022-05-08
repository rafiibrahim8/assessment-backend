'use strict';

const submissionModel = require('../models/Submission');
const gradingModel = require('../models/Grade');

module.exports.create = async (req, res) => {
    let doc = await submissionModel.findById(req.params.submission_id);
    if(! doc){
        res.status(404).json({msg: 'Submission not found.'});
        return;
    }
    if(doc.grade){
        res.status(403).json({msg: 'Grading already done.'});
        return;
    }
    try {
        doc = await gradingModel.create(req.body);
        await submissionModel.findByIdAndUpdate(req.params.submission_id, {grade: doc._id});
        res.status(201).json({msg: 'Success'});
    } catch (err) {
        res.status(403).json({msg: `Reason: ${err}`});
    }
};

module.exports.del = async (req, res) => {
    let doc = await submissionModel.findById(req.params.submission_id);
    if(! (doc && doc.grade)){
        res.status(404).json({msg: 'Grade not found.'});
        return;
    }
    try {
        await gradingModel.findByIdAndDelete(doc.grade);
        await submissionModel.findByIdAndUpdate(req.params.submission_id, {$unset:{grade: 1}});
        res.status(200).json({msg: 'Success'});
    } catch (err) {
        res.status(400).json({msg: err});
    }
};

module.exports.patch = async (req, res) => {
    let doc = await submissionModel.findById(req.params.submission_id);

    if(! (doc && doc.grade)){
        res.status(404).json({msg: 'Grade not found.'});
        return;
    }

    try {
        doc = await gradingModel.findByIdAndUpdate(doc.grade, req.body);
        if(doc){
            res.status(200).json({msg: 'Success'});
            return;
        }
        res.status(400).json({msg: 'Failed to update'});
    } catch (err) {
        res.status(400).json({msg: err});
    }
};
