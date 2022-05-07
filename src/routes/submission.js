'use strict';

const router  = require('express').Router();
const submission = require('../controllers/submission');
const {jsonParser, formParser} = require('../middlewares/submission');

router.route('/').get(jsonParser(6), submission.viewAll);
router.route('/submit/:assesment_id').post(formParser(5), submission.submit); // As we are accecepting file body parser should be different
router.route('/:submission_id').get(jsonParser(7), submission.view);
router.route('/:submission_id').delete(jsonParser(4), submission.del);
router.route('/:submission_id').patch(formParser(4), submission.patch);

router.route('/:submission_id/grade').post(jsonParser(6), submission.grade.create);
router.route('/:submission_id/grade').delete(jsonParser(4), submission.grade.del);
router.route('/:submission_id/grade').patch(jsonParser(4), submission.grade.patch);

router.route('/:submission_id/attachment/:file_name').get(jsonParser(7), submission.attachment.getOne);

module.exports = router;
