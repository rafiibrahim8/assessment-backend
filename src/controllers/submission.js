'use strict';

const submissionModel = require('../models/Submission');
const assessmentModel = require('../models/Assessment');
const grade = require('./grade');
const attachment = require('./attachment');
const fs = require('fs');
const path = require('path');

module.exports.submit = async (req, res) => {
    let doc = await assessmentModel.findById(req.params.assessment_id);
    if(! doc){
        res.status(404).json({msg: 'assessment not found.'});
        return;
    }

    if(doc.deadline < Date.now()){
        res.status(404).json({msg: 'Deadline expired.'});
        return;
    }

    req.submission.submitted_by = req.user._id;

    doc = await submissionModel.findOne({assessment: req.params.assessment_id, submitted_by: req.user._id});

    if(doc){
        res.status(403).json({msg: 'User already submitted this assessment'});
        return;
    }

    try{
        req.submission.assessment = req.params.assessment_id;
        await submissionModel.create(req.submission);
        res.status(201).json({msg: "Submission received"});
    } catch(err){
        console.log(err);
        res.status(400).json({msg: "Bad request"});
    }
};

module.exports.viewAll = async (req, res) => {
    let filter = {};
    if(req.user.role === 'student'){
        filter.submitted_by = req.user._id;
    }

    let docs = await submissionModel.find(filter).populate({
        path: 'submitted_by',
        select: 'username full_name -_id'
    }).populate({
        path: 'grade',
        select: 'mark remarks -_id'
    }).populate({
        path: 'assessment',
        select: 'title',
        populate:{
            path: 'mentor',
            select: 'username full_name -_id'
        }
    }).select('-__v').lean().exec();

    res.status(200).json(docs);
};

module.exports.view = async (req, res) => {
    let filter = {_id: req.params.submission_id};
    if(req.user.role === 'student'){
        filter.submitted_by = req.user._id;
    }
    console.log(filter);
    let doc = await submissionModel.findOne(filter).populate({
        path: 'submitted_by',
        select: 'username full_name -_id'
    }).populate({
        path: 'grade',
        select: 'mark remarks -_id'
    }).populate({
        path: 'assessment',
        select: 'title',
        populate:{
            path: 'mentor',
            select: 'username full_name -_id'
        }
    }).select('-__v').lean().exec();
    if(!doc){
        res.status(403).json({msg: 'Submission not found or insufficient permission.'});
        return;
    }
    res.status(200).json(doc);
};

module.exports.del = async (req, res) => {
    try {
        let doc = await submissionModel.findByIdAndDelete(req.params.submission_id);
        if(doc){
            try{
                fs.unlinkSync(path.join(process.env.UPLOAD_PATH, doc.content));
            }catch(err){}
            res.status(200).json({msg: 'Success'});
            return;
        }
        res.status(404).json({msg: 'Submission not found'});
    } catch (err) {
        res.status(400).json({msg: err});
    }
};

module.exports.patch = async (req, res) => {
    try {
        let doc = await submissionModel.findByIdAndUpdate(req.params.submission_id, req.submission);
        if(doc){
            res.status(200).json({msg: 'Success'});
            return;
        }
        res.status(404).json({msg: 'Submission not found'});
    } catch (err) {
        res.status(400).json({msg: err});
    }
};

module.exports.grade = grade;
module.exports.attachment = attachment;
