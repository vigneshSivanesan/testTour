
const mongoose =  require('mongoose')

const cartSchema = new mongoose.Schema({
userId: {type: mongoose.Schema.Types.ObjectId, required: true},
cartItems: [{
   product: {type: mongoose.Schema.Types.ObjectId, required: true},
   quantity: {type: Number, default:1},
   price: {type: Number, required: true}
}]
},{timestamps: true});

module.exports =  mongoose.model('carts',cartSchema); 