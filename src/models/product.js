

const mongoose =  require('mongoose')

const productSchema = new mongoose.Schema({
name: {required:true, type:String, trim: true},
slug: {required:true, type:String, unique: true},
price: {type: Number,reqired: true},
description:{type:String, trim: true, required: true},
quantity: {type: Number, required: true},
offer:Number,
productImage: [
    {img: {type: String}}
],
review:[
    {userId:{type:mongoose.Schema.Types.ObjectId}, review:String}
],
category : {type: mongoose.Schema.Types.ObjectId, required: true},
createdBy : mongoose.Schema.Types.ObjectId,
updatedAt: Date,
},{timestamps: true});

module.exports =  mongoose.model('products',productSchema) 