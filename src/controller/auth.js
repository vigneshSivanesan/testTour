

const User = require('../models/user');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const sendEmail = require('../utils/email');
const crypto = require('crypto');



const sentToken = (user,statusCode,res) => {
    const token =  createToken(user._id);

    const cookieOpitons = {
        expires: new Date(Date.now() + 1 * 24 * 60 * 60 *1000),
        httpOnly: true
    }
    if(process.env.NODE_ENV === 'production') {
        cookieOpitons.secure = true;
    }
   
    res.cookie('jwt',token, cookieOpitons);
    res.status(statusCode).json({
        status:'Success',
        token: token,
        data:user
    })
}

const createToken =(userId) => {
    const  token = jwt.sign({_id:userId},process.env.JWT_SECRET,{expiresIn: "5s"});
    return token;
}

exports.signup = (req, res) => {
    try {
        if (req.body && req.body.email && req.body.password) {
            User.findOne({ email: req.body.email, isDeleted:false }).exec((error, user) => {
                if (user) {
                    return res.status(400).json({ message: 'Already user present' });
                } else {
                    const { firstName, lastName, email, password } = req.body;
                    const _user = new User({
                        firstName, lastName, email, password,
                        userName: Math.random().toString()
                    });

                    _user.save((error, data) => {
                        if (error) {
                            return res.status(500).json({ message: error });
                        }
                        if (data) {
                            return res.status(200).json({ message: 'sucessfully user created', data: data });
                        }
                    });
                }
            });
        } else {
            return res.status(400).json({ message: 'Bad request' });
        }

    }
    catch (e) {
        return res.status(500).json({ message: error });
    }
};

exports.signin = catchAsync(async (req, res, next) => {
    if (req.body && req.body.email && req.body.password) {
        const user = await User.findOne({ email: req.body.email, isDeleted:false }).exec();
        if (user) {
            if (user.authenticate(req.body.password)) {

                sentToken(user,200,res);

            } else {
                return next(new AppError('password is notmatched', 200));
            }

        } else {
            return next(new AppError('no record found', 200));
        }


    } else {
        return next(new AppError('Bad request', 404));
    }

});

exports.requireSignin = catchAsync(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return next(new AppError('You are not logged in! please log in to get access', 401))
        }
        const jwtDetails = jwt.verify(token, process.env.JWT_SECRET);
        const currentUser = await User.findOne({ _id: jwtDetails._id, isDeleted: false }).exec();
        req.user = currentUser;
        if (!currentUser) {
            return next(new AppError('The user belonging to this token is no longer exist', 401));
        }
    } else {
        return next(new AppError('Authroization required', 401));
    }
    next();
});


exports.restrictTo = (...roles) => {
    return (req, res, next) => {

        if (!roles.includes(req.user.role)) {
            return next(new AppError('you dont have permission to perform this action', 403));
        }
        next();
    }
}

exports.resetPassword = catchAsync(async (req, res, next) => {

    const hashToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({ passwordResetToken: hashToken, passwordResetExpire: { $gt: Date.now() } });

    if (!user) {
        return next(new AppError('Token is invalid or expired', 401))
    }

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;
    await user.save();

    sentToken(user,200,res);

});

exports.updatePassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ _id: req.user._id }).exec();
    if (!user.authenticate(req.body.currentPassword)) {
        return next(new AppError('Your current password is wrong!please check'));
    }
    if (req.body.password && req.body.confirmPassword && req.body.password === req.body.confirmPassword) {
        user.password = req.body.password;
        user.confirmPassword = req.body.confirmPassword;
        await user.save();
        sentToken(user,200,res);

    } else {
        return next(new AppError('Your confirm password is not matched!please check'));
    }
});

exports.forgotPassword = catchAsync(async (req, res, next) => {

    const user = await User.findOne({ email: req.body.email, isDeleted: false }).exec();
    if (!user) {
        return next(new AppError('The is no user with this email address', 404));
    }
    const resetToken = user.createPasswordResetToken()
    await user.save({ validateBeforeSave: false });
    const resetURL = `${req.protocol}://${req.get('host')}/api/resetPassword/${resetToken}`;
    const message = `Forgot your password? please submit the patch request with new password and confirm password to:${resetURL}`;
    try {
        let mailDetails = await sendEmail({
            email: 'vignesh.sivanesan@softsuave.com',
            subject: 'password reset',
            content: message

        })
        res.status(201).json({
            status: 'Sucesss',
            message: 'Email send successfully',
            data: mailDetails
        })

    } catch (e) {
        user.passwordResetToken = undefined;
        user.passwordResetExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new AppError('There was an error in sending email,please try later', 500));
    }
});


// exports.adminMiddleware = (req,res,next) => {
//     if(req.user.role !== 'admin'){
//         res.status(400).json({message:'Access denied'});
//     }
//     next();
// }

// exports.userMiddleware = (req,res,next) => {
//     if(req.user.role !== 'user'){
//         res.status(400).json({message:'Access denied'});
//     }
//     next();
// }