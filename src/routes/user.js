'use strict';

const router  = require('express').Router();
const user = require('../controllers/user');
const auth = require('../middlewares/auth');
const permission = require('../middlewares/permission');

router.use(auth);

router.route('/').get(permission('read_all', 'user'), user.viewAll);
router.route('/').post(permission('create', 'user'), user.create);
router.route('/:username').get(permission('read', 'user'), user.view);
router.route('/:username').delete(permission('delete', 'user'), user.del);
router.route('/:username').patch(permission('update', 'user'), user.patch);

module.exports = router;
