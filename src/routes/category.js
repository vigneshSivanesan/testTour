const express =  require('express');
const { createCategory, getCategoryList} = require('../../src/controller/category');
const { requireSignin, adminMiddleware} = require('../controller/auth');
const multer =  require('multer');
const router =  express.Router();
const shortid =  require('shortid');
const path =  require('path');


const storage =  multer.diskStorage({
    destination: function(req,file,cb){
        cb(null, path.join(path.dirname(__dirname),'routes','uploads'))
    },
    filename: function(req,file, cb) {
      cb(null, shortid.generate() + '-' + file.originalname)
    }
})
const upload =  multer({storage: storage});

//router.post('/category/create', requireSignin,adminMiddleware,createCategory);
router.post('/category/create',upload.array('categoryImage'),createCategory);
router.get('/category/getList', getCategoryList);
module.exports = router;