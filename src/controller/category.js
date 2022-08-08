const category =  require('../models/category');
const slugify =  require('slugify');


function loadCategoryList(categories, parentId){
  const categoryList = [];
  let category;
  if(!parentId){
category = categories.filter(cat => !cat.parentId);
  } else {
    category = categories.filter(cat => cat.parentId == parentId);
  }
  for (let cate of category){
    categoryList.push({
        _id : cate._id,
        name: cate.name,
        slug: cate.slug,
        children: loadCategoryList(categories,cate._id)
    })
  }
  return categoryList;
}

exports.getCategoryList = (req,res) => {
    try {
        category.find({}).exec((error, data) => {
           if(error) {
               res.status(400).json({message:error });
           } else if(data) {
               const categoryList =  loadCategoryList(data)
            res.status(200).json({data:categoryList, message:'category list fetched successfully' });
           }
        }); 
    }
    catch(e) {
        res.status(400).json({message:e});
    }
}

exports.createCategory = (req,res) => {
    try{
       if(req.body) {
           const categories = {
               name: req.body.name,
               slug: slugify(req.body.name),
               parentId: req.body.parentId ? req.body.parentId: null
           }
           if(req.body.file) {
            categories.categoryImage = 'http://localhost:3200/public' + req.file.filename;
        }
           const cat =  new category(categories);
           cat.save((error,data) =>{
               if(error) {
                   res.status(400).json({message:error})
               } else if(data) {
                res.status(200).json({data:data, message: 'category created successfully'});
               }
           });
       } else {
        return  res.status(400).json({message: 'bad request'});
       }
      
    } catch(e) {
        return  res.status(400).json({message: e});

    }
}