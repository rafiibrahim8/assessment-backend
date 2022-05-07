const auth = require('./auth')
const jsonBodyParser = require('express').json();

module.exports = (permission)=>{
    return [auth(permission), jsonBodyParser];
};
