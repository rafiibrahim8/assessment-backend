'use strict';

const jsonwebtoken = require('jsonwebtoken');
const userModel = require('../models/User');

module.exports =  async (req, res, next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.toLowerCase().startsWith("bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if(!token) {
        res.status(403).json({msg: "Must logged in"});
        return;
    }

    try {
        const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findOne({username: decoded.username});

        if(!user) {
            res.status(403).json({msg: "User no longer exist."});
            return;
        }
        if(! user.active){
            res.status(403).json({msg: "User deactivated"});
            return;
        }
        if(! (user.logged_in && user.random == decoded.random)){
            res.status(403).json({msg: "Must logged in"});
            return;
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(403).json({msg: "Must logged in"});
    }
};
