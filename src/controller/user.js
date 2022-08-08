const catchAsync  =  require('../utils/catchAsync');
const userModel  = require('../models/user');
const AppError = require('../utils/appError');

exports.createUser = catchAsync(async(req,res,next) => {
    const user = req.body;
    const isUserPresent = await userModel.findOne({email: user.email, isDeleted: false}).exec();
    if(isUserPresent) {
        res.status(400).json('User already present');
    } else {
         const newUser =  new userModel(user);
          const createdUser = await newUser.save();
          if(createdUser) {
              res.status(200).json({
                  status: 'Success',
                  data: createdUser,
                  message: 'User created successfully'
              });
          } else {
              return next(new AppError('Something went wrong', 500));
          }
    }
});

exports.updateUser =  catchAsync(async(req,res,next) => {
    const user = req.body;
    const updateUser = await userModel.findOneAndUpdate({_id: user._id},{$set:{ name: user.name,
    email: user.email}}).exec();
    if(updateUser) {
        res.status(200).json({
          status:'Success',
          data: user,
          message: 'User updated successfully'
        });

    } else {
           return next(new AppError('Something went wrong', 500));
    }

});

exports.getUser = catchAsync(async(req,res,next)=> {
    const user  = await userModel.findOne({_id: req.params.id, isDeleted:false}).exec();
    if(user) {
        res.status(200).json({
        status: 'Success',
        data: user,
        message:'User fetched successfully'
        });
    } else {
        return next(new AppError('Something went wrong', 500));
    }
});

exports.userList =  catchAsync(async(req,res,next)=> {
    const userList = await userModel.find({isDeleted: false}).exec();
    if(userList) {
        res.status(200).json({
            status:'Success',
            data: userList,
            message:'User list fetched successfully'
        });
    } else {
        return next(new AppError('Something went wrong', 500));
    }
});