const mongoose =  require('mongoose');
const bcrypt =  require('bcrypt');
const crypto = require('crypto');
const { stringify } = require('querystring');

const userSchema = new mongoose.Schema({
   name: {type:String, required: true, trim: true},
   email: {type:String, required: true, trim: true, lowercase: true, unique: true},
   // hash_password: {type:String, required: true},
    password: {type:String, required: true},
   confirmPassword:{type:String, required: [true, 'please confirm your passsword'],
   validate: {
       validator: function(el) {
           return el === this.password;
       },
       message: 'Passwords are not same'
   }
},
   role: {type:String, enum:['user','admin','guide','lead-guide'], default:'user'},
   contactNumber:String, 
   profilePicture: String,
   isDeleted: {default: false, type:Boolean},
   passwordResetToken : String,
   passwordResetExpire: Date
}, 
{timestamps: true}
);

userSchema.pre('save',async function(next){
 if(!this.isModified('password')) {
     return next();
 } else {
     this.password = await bcrypt.hash(this.password,10);
     this.confirmPassword = null;
     next();
 }

});

// userSchema.virtual('password').set(function(password){
// this.hash_password = bcrypt.hashSync(password, 10);
// });

userSchema.methods = {
    authenticate: function(password){
        return bcrypt.compareSync(password, this.password);
    }
}

userSchema.methods.createPasswordResetToken = function(){
    let resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpire = Date.now() + 10 *60*1000;
    return resetToken;

}

module.exports = mongoose.model('Users', userSchema);