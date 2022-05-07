'use strict';

const router  = require('express').Router();
const submission = require('../controllers/submission');
const auth = require('../middlewares/auth');
const permission = require('../middlewares/permission');
const multipart_data = require('../middlewares/mulipart-data');

router.use(auth);

router.route('/').get(permission('read', 'submission'), submission.viewAll);

router.route('/submit/:assessment_id').post(permission('create', 'submission'), multipart_data(), submission.submit);
router.route('/:submission_id/grade').post(permission('create', 'grade'), submission.grade.create);
router.route('/:submission_id/grade').delete(permission('delete', 'grade'), submission.grade.del);
router.route('/:submission_id/grade').patch(permission('update', 'grade'), submission.grade.patch);

router.route('/:submission_id').get(permission('read', 'submission'), submission.view);
router.route('/:submission_id').delete(permission('delete', 'submission'), submission.del);
router.route('/:submission_id').patch(permission('update', 'submission'), multipart_data(), submission.patch);

router.route('/:submission_id/attachment/:file_name').get(permission('read', 'submission'), submission.attachment.getOne);

module.exports = router;
