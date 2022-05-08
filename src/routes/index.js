'use strict';

const submission = require('./submission');
const account = require('./account');
const assessment = require('./assessment');
const user = require('./user');
const router  = require('express').Router();

router.use('/account', account);
router.use('/assessment', assessment);
router.use('/submission', submission);
router.use('/user', user);

module.exports = router;
