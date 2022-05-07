'use strict';

const router  = require('express').Router();
const assessment = require('../controllers/assessment');
const permission = require('../middlewares/permission');
const auth = require('../middlewares/auth');

router.use(auth);

router.route('/').post(permission('read', 'assessment'), assessment.viewAll);
router.route('/create').post(permission('create', 'assessment'), assessment.create);
router.route('/:assessment_id').get(permission('read', 'assessment'), assessment.view);
router.route('/:assessment_id').delete(permission('delete', 'assessment'), assessment.del);
router.route('/:assessment_id').patch(permission('update', 'assessment'), assessment.patch);

module.exports = router;
