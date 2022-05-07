'use strict';

const auth = require('./auth');
const jsonBodyParser = require('express').json();

const account = (authRequired = false) => {
    if(authRequired){
        return [auth(), jsonBodyParser];
    }
    return [jsonBodyParser];
};

module.exports = account;
