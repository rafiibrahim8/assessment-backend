'use strict';

/**
 * Responds with a json instead of default http if any server error occoured.
*/

module.exports = (func) => (req, res, next) => {
    Promise.resolve(func(req, res)).then(value => {
        next();
    }).catch(err => {
        res.status(500).json({msg: 'Internal server error'});
    });
};
