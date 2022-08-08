

const User = require('../../models/user');
const jwt = require('jsonwebtoken');

const sentToken = (user,statusCode,res) => {
    const token =  createToken(user._id);
    res.status(statusCode).json({
        status:'Success',
        token: token,
        data:user
    })
}

const createToken =(userId) => {
    const  token = jwt.sign({_id:userId},process.env.JWT_SECRET,{expiresIn: "1h"});
    return token;
}

exports.signup =  (req,res) => {
   try{
    if(req.body && req.body.email && req.body.password ) {
        User.findOne({email: req.body.email, isDeleted:false}).exec((error, user)=> {
            if(user){
              return res.status(400).json({message:'Already user present'});
            }  else {
                const {firstName, lastName,email, password} = req.body;
                const _user = new User({
                   firstName, lastName,email, password,
                   userName: Math.random().toString(),
                   role: "admin"
                });
    
                _user.save((error, data) => {
                  if(error){
                      return res.status(500).json({message:error});
                  }
                  if(data) {
                      return res.status(200).json({message:'Admin user created successfully', data: data});
                  }
                });
            }   
    });
    } else {
        return res.status(400).json({message:'Bad request'});
    }
   
}
    catch(e) {
        return res.status(500).json({message:error});
    }
};

exports.signin = (req, res) => {
    try{
        if(req.body && req.body.email && req.body.password) {
            User.findOne({email: req.body.email,isDeleted: false}).exec((error,user) => {
                if(error) {
                    return res.status(500).json({message: error})
                }
                if(user){
                    if(user.authenticate(req.body.password)){
                        sentToken(user,200,res);

                    } else {
                        return res.status(200).json({message:'password is notmatched'});
                    }

                } else {
                    return res.status(200).json({message:'no record found'});
                }

            });

        } else {

            return res.status(400).json({message:'Bad request'});
        }

    }
    catch(e) {
        return res.status(500).json({message: error})
    }
}

exports.requireSignin = (req,res,next) => {
    const token =  req.headers.authorization.split(" ")[1];
    const user =  jwt.verify(token, process.env.JWT_SECRET);
     req.user = user;
      next();
}