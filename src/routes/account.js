'use strict';

const router  = require('express').Router();
const auth = require('../middlewares/auth');
const account = require('../controllers/account');

router.route('/signup').post(account.signup);
router.route('/login').post(account.login);
router.route('/logout').post(auth, account.logout);
router.route('/me').get(auth, account.me);

module.exports = router;
