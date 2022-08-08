const mongoose =  require('mongoose');

const reviewSchema = new  mongoose.Schema({
 review: {
type: String,
required:[true,'Review cannot be empty']
 },
 rating: {
     type: Number
 },
 createdAt:{
     type: Date,
     default: Date.now
 },
 isDeleted:{
 type: Boolean,
 default: false
 },
 tourId:{
     type: mongoose.Schema.ObjectId,
     ref:'tours',
     required:[true,'A review must belong to a tour']
 },
 userId:{
     type: mongoose.Schema.ObjectId,
     ref:'Users',
     required:[true,'A review must belong to a user']
 }
});

reviewSchema.pre(/^find/, function(next){
    // this.populate({
    //     path:'tourId',
    //     select: 'name'
    // }).populate({
    //     path: 'userId',
    //     select: 'firstName lastName profilePicture'
    // });
    this.populate({
        path: 'userId',
        select: 'firstName lastName profilePicture'
    });
    next();
})

module.exports = mongoose.model('reviews',reviewSchema );