'use strict';

const jsonwebtoken = require('jsonwebtoken');
const userModel = require('../models/User');

/**
 * Authorises user and check for permission.
 * @param {Number} permission The permission number. This follows unix permission like structure.
 * Permission is a 3 bit number. the left most bit represents admin has permission or not.
 * 
 * 2nd bit for mentor, and the right most bit for student.
 * 
 * For example permission 101 (binary) or 5 (decimal) means, admin and student has access, mentor don't.
 * @returns {express.nextHandleFunction} nextHandle
 */

const auth = (permission=7) => {
    return async (req, res, next) => {
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
            let userPermission = user.role === 'admin'? 4 : (user.role ==='mentor'? 2: 1);
            if(permission & userPermission){
                next();
                return;
            }
            res.status(403).json({msg: "Insufficient permission"});
        } catch (err) {
            res.status(403).json({msg: "Must logged in"});
            return;
        }
    }
};

module.exports = auth;
