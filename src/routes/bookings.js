const express = require('express');
const { requireSignin } = require('../controller/auth');
const { createBookings } = require('../controller/booking');
const router = express.Router();


 router.post('/createBookings', requireSignin,createBookings);


module.exports = router;