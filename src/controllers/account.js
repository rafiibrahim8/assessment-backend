'use strict';

const crypto = require('crypto');
const userModel = require('../models/User');
const promiseResolve = require('../utils/promiseResolve');

module.exports.signup = promiseResolve(async (req, res) => {;
    let {username, password, full_name, email, role} = req.body;
    let vars = {username, password, full_name, email, role};
    let user = await userModel.findOne({username});
    if(user){
        res.status(409).json({msg: "User already exists."});
        return;
    }
    if(role==='admin'){
        res.status(403).json({msg: "Admin account creation is not allowed"});
        return;
    }
    vars.active = role === 'student' ? true:false;
    try{
        await userModel.create(vars);
        res.status(201).json({msg: "Account created"});
    } catch(err){
        res.status(400).json({msg: `Bad request. Reason: ${err}`});
    }
});

module.exports.login = promiseResolve(async (req, res)=>{
    let {username, password} = req.body;
    let user = await userModel.findOne({username});
    if(!user){
        res.status(403).json({msg: "Invalid username or password."});
        return;
    }
    if(! user.checkPasswd(password)){
        res.status(403).json({msg: "Invalid username or password."});
        return;
    }

    if(!user.active){
        res.status(403).json({msg: "User deactivated"});
        return;
    }
    
    let random = crypto.randomBytes(16).toString('hex');
    await userModel.updateOne({username}, {logged_in: true, random});
    res.status(200).json({token: user.getJWT(random)});
});

module.exports.logout = promiseResolve(async (req, res)=>{
    let {username} = req.user;
    await userModel.updateOne({username}, {logged_in: false});
    res.status(200).json({msg:'Successful'});
});

module.exports.me = promiseResolve(async (req, res)=>{
    let {username, full_name, email, role} = req.user;
    res.status(200).json({username, full_name, email, role});
});
