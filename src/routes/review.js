const express =  require('express');
const { getAll, getReview, createReview,  deleteReview } = require('../controller/review');
const router =  express.Router();
const { requireSignin, restrictTo} = require('../controller/auth');

router.get('/review/list',requireSignin,restrictTo('admin'), getAll);
router.get('/review/:id',requireSignin, getReview);
router.post('/review/create',requireSignin, createReview);
router.delete('/review/delete',requireSignin,restrictTo('admin'), deleteReview);



module.exports = router;