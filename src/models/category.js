const mongoose =  require('mongoose')

const categorySchema = new mongoose.Schema({
name: {required:true, type:String, trim: true},
categoryImage:{type: String},
slug: {required:true, type:String, unique: true},
parentId: {type: String}
},{timestamps: true});

module.exports =  mongoose.model('categories',categorySchema) 