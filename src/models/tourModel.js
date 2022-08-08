const mongoose =  require('mongoose');

const tourSchema = new mongoose.Schema({
name:{
    type: String,
    required:[true,'A name must provide'],
    unique: true
},
rating:{
    type:Number,
    default: 4.5
},
ratingAverage:{
    type: Number,
    default: 4.5
},
ratingQuantity:{
    type:Number,
    default:0
},
duration:{
    type:Number,
    required:[true,'A tour must have duration']
},
maxMemberSize:{
type: Number,
required:[true, 'A tour must have member size']
},
difficulty:{
type: String,
required:[true, 'A tour must have difficulty']
},
price:{
    type:Number,
    required:[true,'A tour must have price']
},
description:{
    type: String,
    trim: true
},
imageCover:{
    type:String
},
images:[String],
priceDiscount:Number,
    summary:{
        type: String,
        trim: true
    },
startDates:[Date],
location:[
 {
     type:{
         type: String,
     },
     coordinates:[Number],
     address: String,
     description: String,
     day: Number
 }
],
guides:[{
    type: mongoose.Schema.ObjectId,
    ref:'Users'
}
], 
isDeleted: {default: false, type:Boolean},
createdAt: {
    type: Date,
    default: Date.now
},
modifiedAt:{
    type: Date,
    default: Date.now
},

startLocation:{
    type:{
        type: String,
        default:'Point',
        
    },
    coordinates:[Number],
    address:String,
    description:String
},
location:[
    {
        type:{
            type: String,
            default:'Point',
        },
        coordinates:[Number],
        address:String,
        description:String,
        day:Number
    }
],
deletedAt: Date,
},
{
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

tourSchema.virtual('review',{
    ref: 'reviews',
    foreignField:'tourId',
    localField:'_id'
});


tourSchema.virtual('durationWeeks').get(function(){
 return this.duration / 7;
});


tourSchema.pre('save', function(next) {
   if(this.new){
       this.createdAt = this.createdAt || new Date();
       this.modifiedAt = this.modifiedAt || new Date();
   } else {
       this.modifiedAt = new Date();
   }
   next();
})



// tourSchema.pre(/^find/, function(next){
//  this.populate('guides', 'firstName lastName email role contactNumber profilePicture');
//  next();
// });

module.exports = mongoose.model('tours', tourSchema);
