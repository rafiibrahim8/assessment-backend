'use strict';

const userModel = require('../models/User');
const promiseResolve = require('../utils/promiseResolve');

module.exports.create = promiseResolve(async (req, res) => {
    let doc = await userModel.findOne({username: req.body.username});
    if(doc){
        res.status(403).json({msg: 'User already exists.'});
        return;
    }
    try{
        doc = await userModel.create(req.body);
        res.status(201).json(doc);
    } catch(err){
        res.status(400).json({msg: `Failed to create user. Reason: ${err}`});
    }
});

module.exports.viewAll = promiseResolve(async (req, res) => {
    let results = await userModel.find().select('username full_name role email active logged_in').lean().exec();
    res.status(200).json(results);
});

module.exports.view = promiseResolve(async (req, res) => {
    let select = 'username full_name role -_id'
    if(req.user.role === 'admin'){
        select = select + ' email active logged_in'
    }
    let doc = await userModel.findOne({username: req.params.username}).select(select).lean().exec();
    if(!doc){
        res.status(404).json({msg: 'User not found'});
    }

    res.status(200).json(doc);
});

module.exports.del = promiseResolve(async (req, res) => {
    try {
        let doc = await userModel.findOneAndDelete({username: req.params.username});
        if(! doc){
            res.status(404).json({msg: 'User not found.'});
            return;
        }
        res.status(200).json({msg: 'Success'});
    } catch (err) {
        res.status(400).json({msg: err});
    }
});

module.exports.patch = promiseResolve(async (req, res) => {
    try {
        let doc = await userModel.findOneAndUpdate({username: req.params.username}, req.body);
        if(doc){
            res.status(200).json({msg: 'Success'});
            return;
        }
        res.status(400).json({msg: 'Failed to update'});
    } catch (err) {
        res.status(400).json({msg: `Error. Reason: ${err}`});
    }
});
