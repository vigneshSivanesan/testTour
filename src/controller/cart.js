const Cart =  require('../models/cart');
const slugify =  require('slugify');


exports.addCart = (req,res) => {
    try {
      
        if(req.body) {
            Cart.findOne({userId: req.body.userId}).exec((error,data) => {
                if(error)  {
                    res.status(200).json({message: error});
                } else if(data) {
                    const item =  data.cartItems.find(c => c.product == req.body.cartItems.product );
                    let condition,update;
                    if(item) {
                        condition = {userId: req.body.userId, "cartItems.product":  req.body.cartItems.product};
                        update =     {$set: { "cartItems.$" :{ ...req.body.cartItems,
                            quantity: item.quantity + req.body.cartItems.quantity}}};
                    } else {
                        condition = {userId: req.body.userId};
                        update = {"$push":{cartItems:req.body.cartItems}}; 
                    }
                    Cart.findOneAndUpdate(condition,update). exec((error, data) => {
                       if(error){
                           res.status(400).json({message: error});
                       } else if(data) {
                           res.status(200).json({data:data, message: error})
                       }
                    });                  
                } else {
                    const cartItems =  new Cart(req.body);
                    cartItems.save((error,data) => {
                       if(error) {
                            res.status(400).json({message: error});
                       } else if(data) {
                         res.status(200).json({data:data, message: error});
                       }
                    });
                }
             });
        } else {
            res.status(400).json({message: error});
        }

    }
    catch(e) {
        res.status(400).json({message: error});
    }

}