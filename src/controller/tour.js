

const req = require('express/lib/request');
const tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const stripe = require('stripe')('sk_test_51LSO62SAqQhGLLsYHHJHJhzRqGsqcKX32s6Fx5ZtsuEns7fctiC4JHELYe7JhxQEtg8AYJOWllqsvAlLVdd00FYa00Lsp8xnEm')

exports.createTour = catchAsync(async (req, res, next) => {
    const newTour = new tour(req.body);
    const response = await newTour.save();
    if (response) {
        res.status(200).json({
            status: 'Success',
            data: response,
            message: 'create Tour Success'
        });
    } else {
        return next(new AppError('create record failed ', 500));
    }
})

exports.booking =  catchAsync(async (req,res,next)=> {
      if(req.body.tourId) {
        const tourDetails = await tour.findOne({_id:req.body.tourId});
        if(tourDetails){
          stripe.charges.create({
           amount: tourDetails.price ? tourDetails.price:'',
           currency: 'INR',
           description:'test payment',
           source: req.body.token
          }, (error,charge)=> {
                res.status(200).json({
                    status: 'Success'
                });
          });
        } else {
            return next(new AppError('no tour found ', 200));
        }
      } else {
        return next(new AppError('tourId is missing ', 400));
      }
});

exports.getAllTour = catchAsync(async (req, res, next) => {
    const tourList = await tour.find({ isDeleted: false }).
        populate('guides', 'firstName lastName email role contactNumber profilePicture').
        populate('review', 'review rating userId tourId').exec();
    if (tourList) {
        res.status(200).json({
            status: 'Success',
            data: tourList,
            message: 'List fetched successfully'
        });
    } else {
        return next(new AppError('No tours found ', 404));
    }

});

exports.updateTour = catchAsync(async (req, res, next) => {
    const tourRecourd = req.body;
    const updatedTour = await tour.findOneAndUpdate({ _id: tourRecourd._id }, { $set: { name: tourRecourd.name, price: tourRecourd.price, rating: tourRecourd.rating } }).exec();
    if (updatedTour) {
        res.status(200).json({
            status: 'Success',
            data: tourRecourd,
            message: 'Record updated successfully',
        });
    } else {
        return next(new AppError('update record failed ', 500));
    }
});


exports.getTour = catchAsync(async (req, res, next) => {
    const tourData = await tour.findById({ _id: req.params.id, isDeleted: false }).
        populate('guides', 'firstName lastName email role contactNumber profilePicture').
        populate('review', 'review rating userId tourId').exec();
    if (tourData) {
        res.status(200).json({
            status: 'Success',
            data: tourData,
            message: 'Record fetched successfully'
        });
    } else {
        return next(new AppError('No tour found for the ID', 404));
    }
});

exports.distanceTours = catchAsync(async (req, res, next) => {
    const {lat, long } = req.params;

    if (!lat || !long) {
        return next(new AppError('please prvide required details', 500));
    }
    const tours = await tour.aggregate([
        {
            $geoNear: {
                near: {
                    coordinates: [long * 1, lat * 1],
                },
                distanceField: 'distance',
                distanceMultiplier: 0.001
            },

        },
        {
            $project: {
                name: 1,
                distance: 1
            }
        }
    ]);
    if (tours) {
        res.status(200).json({
            status: 'Successs',
            data: tours,
            message: 'Records fetched successfully'
        });

    } else {
        res.status(200).json({
            status: 'Successs',
            data: tours,
            message: 'NO records found'
        });
    }
});


exports.getToursWithin = catchAsync(async (req, res, next) => {
    const { distance, lat, long, unit } = req.params;

    if (!distance || !lat || !long) {
        return next(new AppError('please prvide required details', 500));
    }
    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

    const tours = await tour.find({ startLocation: { $geoWithin: { $centerSphere: [[long, lat], radius] } } });
    if (tours) {
        res.status(200).json({
            status: 'Successs',
            data: tours,
            message: 'Records fetched successfully'
        });

    } else {
        res.status(200).json({
            status: 'Successs',
            data: tours,
            message: 'NO records found'
        });
    }
});

exports.deleteTour = catchAsync(async (req, res, next) => {
    const deletedTour = await tour.findOneAndUpdate({ _id: req.params.id }, { $set: { isDeleted: true } });
    if (deletedTour) {
        res.status(200).json({
            status: 'Success',
            data: deletedTour,
            message: "Record deleted sucessfully"
        });
    } else {
        return next(new AppError('no tour found for this id', 404))
    }
});