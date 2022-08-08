const express =  require('express');
const router = express.Router();
const {createTour, getAllTour, getTour,updateTour,deleteTour, getToursWithin, distanceTours, booking} = require('../controller/tour');
const { requireSignin, restrictTo} = require('../controller/auth');

router.post('/tour/create',requireSignin,restrictTo('admin','lead-guide'),createTour);
router.get('/tour/getList',requireSignin,getAllTour);
router.get('/tour/:id',requireSignin,getTour);
router.get('/tour/within/:distance/:lat/:long/:unit',requireSignin,getToursWithin);
router.get('/tour/distance/:lat/:long/',requireSignin, distanceTours);
router.delete('/tour/delete/:id',requireSignin,restrictTo('admin','lead-guide'),deleteTour);
router.put('/tour/update',requireSignin,restrictTo('admin','lead-guide'), updateTour);
router.post('/tour/payment', requireSignin,booking);
module.exports = router;