const bookings = require('../models/booking');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync')



exports.createBookings =  catchAsync(async(req,res,next)=> {
     if(req.body){
          const booking =  new bookings(req.body)
          const createBooking =  await booking.save();
          if(createBooking){
            res.status(200).json({
                status:'Success',
                data: createBooking,
                message: 'booking created successfully'
            })
          } else {
            return next(AppError('create booking is failed', 400));
          }
     } else{
        return next(AppError('body is missing in request', 400));
     }
});