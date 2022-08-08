const product =  require('../models/product');
const slugify =  require('slugify');


exports.addProduct = (req,res) => {
    try{
        let productImage;
    if(req.body) {       
      if(req.files && req.files.length > 0) {
        productImage= req.files.map(file => {
          return {img: file.filename}
        });
        req.body.productImage = productImage;
        req.body.slug = slugify(req.body.name);
      }
      const addProducts = new product(req.body);
      addProducts.save((error, data) => {
            if(error) {
                   res.status(400).json({message: error});
            } else if(data) {
              res.status(400).json({data: data , message: 'Product created successfully'});
            }
      });
    } else {
      res.status(400).json({message: 'Bad request'});
    }
}
 catch(e) {
  res.status(400).json({message: e});
}

}