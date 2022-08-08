const mongoose =  require('mongoose');


const bookingSchema = new mongoose.Schema({
    tourId:{
        type: mongoose.Schema.ObjectId,
        ref:'tours',
        required:[true,'A review must belong to a tour']
    },
    userId:{
        type: mongoose.Schema.ObjectId,
        ref:'Users',
        required:[true,'A review must belong to a tour']
    },
    price:{
        type: Number,
        ref:'Users',
        required:[true,'A review must belong to a tour']
    },
    createdAt:{
        type:Date,
        default: Date.now()
    },
    paid:{
        type: Boolean,
        default: true
    }
});

bookingSchema.pre('save', function(next) {
    if(this.new){
        this.createdAt = this.createdAt || new Date();
        this.modifiedAt = this.modifiedAt || new Date();
    } else {
        this.modifiedAt = new Date();
    }
    next();
 })
 

 module.exports = mongoose.model('bookings', bookingSchema);

