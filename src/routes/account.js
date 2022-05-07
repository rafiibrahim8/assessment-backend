'use strict';

const router  = require('express').Router();
const {signup, login, logout, me} = require('../controllers/account');
const middlewares = require('../middlewares');

router.route('/signup').post(middlewares.account(), signup);
router.route('/login').post(middlewares.account(), login);
router.route('/logout').post(middlewares.account(true), logout);
router.route('/me').get(middlewares.account(true), me);

module.exports = router;
