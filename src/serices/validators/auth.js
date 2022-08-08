
const {check} =  require('express-validator');

exports.validateAuthValidate = [
    check('firstName').notEmpty().withMessage('firstName is required'),
    check('lastName').notEmpty().withMessage('lastName is required'),
    check('email').isEmail().withMessage('valid email is required'),
    check('password').isLength({min:6}).withMessage('password '),

];
