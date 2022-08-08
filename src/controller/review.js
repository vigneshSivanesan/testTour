const review = require('../models/review');
const AppError = require('../utils/appError');
const catchAsync =  require('../utils/catchAsync');



exports.getAll = catchAsync(async (req,res,next)=> {

    const reviewsList = await review.find({isDeleted: false}).populate('tourId', 'name').exec()
    if(reviewsList) {
        res.status(200).json({
            status:'Success',
            data:reviewsList,
            message: 'The list fetched successfully'
        })
    } else {
        return next(new AppError(200,'No records found'))
    }

});


exports.getReview = catchAsync(async(req,res,next)=> {
const reviewData = await  review.findOne({_id: req.body._id, isDeleted: false}).populate('tourId','name').exec();
if(reviewData) {
    res.status(200).json({
        status:'Success',
        data:reviewData,
        message: 'The list fetched successfully'
    })
} else {
    return next(new AppError(200,'No records found'))
}
});

exports.createReview =  catchAsync(async(req,res,next)=> {
    const reviewData = new review(req.body);
    const data = await  reviewData.save();
    if(data) {
        res.status(201).json({
            status:'Success',
            data:data,
            message: 'Review created successfully'
        })
    } else {
        return next(new AppError(201,'No records found'))
    }
});

exports.deleteReview = catchAsync(async(req,res,next)=> {
    const data =  await review.findOneAndUpdate({_id: req.body._id, isDeleted: false}).exec();
    if(data) {
        res.status(201).json({
            status:'Success',
            data:data,
            message: 'Review deleted successfully'
        })  
    }else {
        return next(new AppError(201,'No records found'))
    }
});