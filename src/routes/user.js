'use strict';

const router  = require('express').Router();
const user = require('../controllers/user');
const middlewares = require('../middlewares');

router.route('/').get(middlewares.user(4), user.viewAll);
router.route('/').post(middlewares.user(4), user.create);
router.route('/:username').get(middlewares.user(7), user.view);
router.route('/:username').delete(middlewares.user(4), user.del);
router.route('/:username').patch(middlewares.user(4), user.patch);

module.exports = router;
