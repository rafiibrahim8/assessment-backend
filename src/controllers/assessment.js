'use strict';

const assessmentModel = require('../models/Assessment');

module.exports.viewAll = async (req, res) => {
    let filter={};
    if(req.body.my_only===true){
        filter.mentor = req.user._id;
    }
    if(req.body.show_expired!==true){
        filter.deadline = {'$gt': Date.now()}
    }
    let results = await assessmentModel.find(filter).populate({
        path: 'mentor',
        select: 'username full_name -_id',
    }).select('-__v -description').lean().exec();
    res.status(200).json(results);
};

module.exports.create = async (req, res) => {
    let {title, description, deadline} = req.body;
    try {
        let vars = {title, description, deadline: new Date(deadline), mentor: req.user._id};
        let doc = await assessmentModel.create(vars);
        res.status(201).json({_id: doc._id});
    } catch (err) {
        res.status(400).json({msg: `Can not create assessment. Reason: ${err}`});
    }
};

module.exports.view = async (req, res) => {
    let doc = await assessmentModel.findById(req.params.assessment_id).populate({
        path: 'mentor',
        select: 'username full_name -_id',
    }).select('-__v').lean().exec();
    if(! doc){
        res.status(404).json({msg: 'assessment not found'});
        return;
    }
    res.status(200).json(doc);
};

module.exports.del = async (req, res) => {
    try {
        let doc = await assessmentModel.findByIdAndDelete(req.params.assessment_id);
        if(doc){
            res.status(200).json({msg: 'Success'});
            return;
        }
        res.status(404).json({msg: 'assessment not found'});
    } catch (err) {
        res.status(400).json({msg: err});
    }
};

module.exports.patch = async (req, res) => {
    try {
        let doc = await assessmentModel.findByIdAndUpdate(req.params.assessment_id, req.body);
        if(doc){
            res.status(200).json({msg: 'Success'});
            return;
        }
        res.status(404).json({msg: 'assessment not found'});
    } catch (err) {
        res.status(400).json({msg: err});
    }
};
