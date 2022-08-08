const express = require('express');
const router = express.Router();
const {createUser, updateUser, getUser,userList} = require('../controller/user')
const { requireSignin, restrictTo} = require('../controller/auth');

router.post('/user/create',requireSignin, createUser);
router.put('/user/update',requireSignin, updateUser);
router.get('/user/list',requireSignin,userList);
router.get('/user/:id',requireSignin,getUser)

module.exports = router;