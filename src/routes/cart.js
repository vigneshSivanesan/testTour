const express =  require('express');
const { addCart} = require('../../src/controller/cart');
const { requireSignin, adminMiddleware} = require('../controller/auth');
const router =  express.Router();

//router.post('/category/create', requireSignin,adminMiddleware,createCategory);
router.post('/cartaddCart/',addCart);
module.exports = router;