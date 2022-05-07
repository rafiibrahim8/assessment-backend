'use strict';

const submissionModel = require('../models/Submission');
const assesmentModel = require('../models/Assessment');
const promiseResolve = require('../utils/promiseResolve');
const grade = require('./grade');
const attachment = require('./attachment');
const fs = require('fs');
const path = require('path');

module.exports.submit = promiseResolve(async (req, res) => {
    let doc = await assesmentModel.findById(req.params.assesment_id);
    if(! doc){
        res.status(404).json({msg: 'Assesment not found.'});
        return;
    }

    if(doc.deadline < Date.now()){
        res.status(404).json({msg: 'Deadline expired.'});
        return;
    }

    req.submission.submitted_by = req.user._id;

    doc = await submissionModel.findOne({assesment: req.submission.assesment, submitted_by: req.user._id});

    if(doc){
        res.status(403).json({msg: 'User already submitted this assesment'});
        return;
    }

    try{
        await submissionModel.create(req.submission);
        res.status(201).json({msg: "Submission received"});
    } catch(err){
        console.log(err);
        res.status(400).json({msg: "Bad request"});
    }
});

module.exports.viewAll = promiseResolve(async (req, res) => {
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
        path: 'assesment',
        select: 'title',
        populate:{
            path: 'mentor',
            select: 'username full_name -_id'
        }
    }).select('-__v').lean().exec();

    res.status(200).json(docs);
});

module.exports.view = promiseResolve(async (req, res) => {
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
        path: 'assesment',
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
});

module.exports.del = promiseResolve(async (req, res) => {
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
});

module.exports.patch = promiseResolve(async (req, res) => {
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
});

module.exports.grade = grade;
module.exports.attachment = attachment;
