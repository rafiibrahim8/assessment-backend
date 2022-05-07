'use strict';

const mongoose = require('mongoose');
const DB_URL = process.env.NODE_ENV === 'test' ? process.env.TEST_DB_URL : process.env.DB_URL;

const connect = async function(){
    await mongoose.connect(
        DB_URL, {
            useNewUrlParser: true,
            serverSelectionTimeoutMS: process.env.DB_CONNECTION_TIMEOUT || 1500
    });  
};

const connectOrExit = function(){
    Promise.resolve(connect()).catch(err=>{
        console.log(`Failed to establish DB connection.\nReason: ${err}`);
        process.exit(255);
    });
};

module.exports = {connect, connectOrExit};
