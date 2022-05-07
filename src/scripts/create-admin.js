'use strict';

require('dotenv').config();
const connectDB = require('../utils/connectDB');
const userModel = require('../models/User');
const mongoose = require('mongoose');
const minimist  = require('minimist');

connectDB.connectOrExit();

const args = minimist(process.argv);
args.role = 'admin';

const create = async () =>{
    await userModel.create(args);
    console.log('Account created.')
    process.exit(0);
}

Promise.resolve(create()).catch(err=>{
    console.log(`Failed to create user.\nReason: ${err}`);
    mongoose.connection.close();
    process.exit(1);
});
