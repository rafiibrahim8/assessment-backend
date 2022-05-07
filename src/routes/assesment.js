'use strict';

const router  = require('express').Router();
const assesment = require('../controllers/assesment');
const middlewares = require('../middlewares');

router.route('/').post(middlewares.assesment(7), assesment.viewAll);
router.route('/create').post(middlewares.assesment(6), assesment.create);
router.route('/:assesment_id').get(middlewares.assesment(7), assesment.view);
router.route('/:assesment_id').delete(middlewares.assesment(4), assesment.del);
router.route('/:assesment_id').patch(middlewares.assesment(4), assesment.patch);

module.exports = router;
