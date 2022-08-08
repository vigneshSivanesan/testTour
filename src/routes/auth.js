const express =  require('express');
const { signup , signin, requireSignin, forgotPassword, resetPassword, updatePassword} = require('../controller/auth');
const router =  express.Router();


router.post('/signin', signin);
router.post('/signup', signup);

router.post('/forgotPassword',forgotPassword);
router.patch('/restPassword/:token',resetPassword);
router.post('/updatePassword',requireSignin,updatePassword);

router.post('/profile',requireSignin, (req,res) => {
console.log('poda');
});

module.exports = router;