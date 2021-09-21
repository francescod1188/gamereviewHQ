const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type:String,
        required:[true,'A name is required']
    },

    email: {
        type:String,
        required:[true,'An email is required'],
        unique:[true,'This email already in use'],
        lowercase: true,
        validate:[validator.isEmail,'Provide a valid email']
    },

    photo: String,

    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },

    password: {
        type: String,
        required: [true, 'A password is required'],
        minlength: 8,
        select:false
    },

    passwordConfirm: {
     type: String,
     required: [true, 'A password is required'],
     validate:{
         //Check that passwords match
         validator: function(el) {
             return el === this.password;
         },
         message:'Passwords do not match'
     }
    },

    passwordChangedAt: Date,
    passwordResetToken:String,
    passwordResetExpiresIn:Date

});//const userSchema

//Runs in between receiving data and storing in the database
userSchema.pre('save', async function(next){
    //If password is not modified
    if(!this.isModified('password')) {
        return next();
    }
    //Hash the password
    this.password = await bcrypt.hash(this.password,12);
    //Required input but not stored in the db
    this.passwordConfirm = undefined;
    next();
});

//Checks if input password matches hashed password
userSchema.methods.correctPassword = async function(inputPassword, userPassword){
    return await bcrypt.compare(inputPassword, userPassword);
}

//Check if password is changed after the user is assigned a token
userSchema.methods.changedPasswordAfter = function(JWTTimestamp){
    //if password is changed
    if(this.passwordChangedAt){
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime()/1000,10);
        //console.log(this.passwordChangedAt, JWTTimestamp);
        return JWTTimestamp < changedTimestamp;
    }
    //Password not changed
    return false;
};//userSchema.methods.changedPasswordAfter

//Create a token for resetting your password
userSchema.methods.generatePasswordResetToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    //console.log({resetToken},this.passwordResetToken);
    //10 minutes to activate password reset
    this.passwordResetExpiresIn = Date.now() + 10 * 60 * 1000;

    return resetToken;
};//userSchema.methods.generatePasswordResetToken

const User = mongoose.model('User',userSchema);

module.exports = User;