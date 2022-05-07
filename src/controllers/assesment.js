'use strict';

const assesmentModel = require('../models/Assessment');
const promiseResolve = require('../utils/promiseResolve');

module.exports.viewAll = promiseResolve(async (req, res) => {
    let filter={};
    if(req.body.my_only===true){
        filter.mentor = req.user._id;
    }
    if(req.body.show_expired!==true){
        filter.deadline = {'$gt': Date.now()}
    }
    let results = await assesmentModel.find(filter).populate({
        path: 'mentor',
        select: 'username full_name -_id',
    }).select('-__v -description').lean().exec();
    res.status(200).json(results);
});

module.exports.create = promiseResolve(async (req, res) => {
    let {title, description, deadline} = req.body;
    try {
        let vars = {title, description, deadline: new Date(deadline), mentor: req.user._id};
        let doc = await assesmentModel.create(vars);
        res.status(201).json({_id: doc._id});
    } catch (err) {
        res.status(400).json({msg: `Can not create assesment. Reason: ${err}`});
    }
});

module.exports.view = promiseResolve(async (req, res) => {
    let doc = await assesmentModel.findById(req.params.assesment_id).populate({
        path: 'mentor',
        select: 'username full_name -_id',
    }).select('-__v').lean().exec();
    if(! doc){
        res.status(404).json({msg: 'Assesment not found'});
        return;
    }
    res.status(200).json(doc);
});

module.exports.del = promiseResolve(async (req, res) => {
    try {
        let doc = await assesmentModel.findByIdAndDelete(req.params.assesment_id);
        if(doc){
            res.status(200).json({msg: 'Success'});
            return;
        }
        res.status(404).json({msg: 'Assesment not found'});
    } catch (err) {
        res.status(400).json({msg: err});
    }
});

module.exports.patch = promiseResolve(async (req, res) => {
    try {
        let doc = await assesmentModel.findByIdAndUpdate(req.params.assesment_id, req.body);
        if(doc){
            res.status(200).json({msg: 'Success'});
            return;
        }
        res.status(404).json({msg: 'Assesment not found'});
    } catch (err) {
        res.status(400).json({msg: err});
    }
});
