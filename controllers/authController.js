const { promisify } = require('util');
const User = require('./../models/userModel');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError');
const app = require('../app');
const sendEmail = require('./../utils/email');
const crypto = require('crypto');

//JWT token when user logs in
const signToken = id => {
    return jwt.sign({id},process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    const cookieOptions =  {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24*60*60*1000),
        httpOnly:true
    };

    res.cookie('jwt', token, cookieOptions);
   
    res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        user
      }
    });
  };

//Logout function
exports.logout = (req,res) => {
    res.cookie('jwt','loggedout', {
        expires: new Date(Date.now()+10*1000),
        httpOnly:true
    });
    res.status(200).json({status:'success'});  
};
//Signup new user
exports.signup = async (req,res,next ) => {
    try{
        const newUser = await User.create({
            username:req.body.username,
            email:req.body.email,
            password:req.body.password,
            passwordConfirm:req.body.passwordConfirm,
            passwordChangedAt:req.body.passwordChangedAt,
            role:req.body.role
        });

        createSendToken(newUser,201,res);
    }//try

    catch(err){
        res.status(404).json({
            status: 'fail',
            message:err
        });
    }
    
};//exports.signup

//Login
exports.login = async (req,res,next) => {
    try{
        const {email, password} = req.body;

        //Check if email and password are entered
        if(!email || !password){
            return next(new AppError('Please provide an email and password', 400));
        }

        const user = await User.findOne({email:email}).select('+password');

        if(!user || !await user.correctPassword(password, user.password)){
            return next(new AppError('Incorrect email or password',401));
        }
        
        createSendToken(user, 200, res);
    }//try

    catch(err){
        res.status(404).json({
            status: 'fail',
            message:err
        });
    }   
};//exports.login


//Check if user is logged in before accessing certain routes
exports.protect = async(req,res,next) => {
    try{
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1];
        }
        //Allow authorization through cookies
        else if(req.cookies.jwt){
            token = req.cookies.jwt;
        }

        //Check for token
        if(!token){
            return next(new AppError('You are not logged in! Login for access', 401));
        }
        //Verify token
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
        //console.log(decoded);

        //Check if user still exists
        const updatedUser = await User.findById(decoded.id);
        if(!updatedUser){
            return next(new AppError('The user belonging to this token does not exist',401));
        }
        //If password was changed recently
        if(updatedUser.changedPasswordAfter(decoded.iat)){
            return next(newAppError('User recently changed password recently, log in again',401));
        }

        //Give user access to protected route if all login and password requirements are met
        req.user = updatedUser;
        next();
    }//try

    catch(err){
        res.status(404).json({
            status: 'fail',
            message:err
        });
    } 
};//exports.protect

exports.isLoggedIn = async(req,res,next) => {

    //Check for cookie to validate logged in user
    if (req.cookies.jwt) {
        try{
            // 1) verify token
        const decoded = await promisify(jwt.verify)(
            req.cookies.jwt,
            process.env.JWT_SECRET
        );
    
        // 2) Check if user still exists
        const updatedUser = await User.findById(decoded.id);
        if (!updatedUser) {
            return next();
        }
    
        // 3) Check if user changed password after the token was issued
        if (updatedUser.changedPasswordAfter(decoded.iat)) {
            return next();
        }
    
        // THERE IS A LOGGED IN USER
        res.locals.user = updatedUser;
        return next();
        } 
        catch(err){
            return next();
        }
    } 
    next(); 
};//exports.isLoggedIn

//Restrict certain actions to admin only
exports.restrictTo = (...roles) => {
    return(req,res,next) => {
        if(!roles.includes(req.user.role)){
            return next(new AppError('You do not have permission for this action', 403));
        }
        //Proceed with action if admin
        next();
    };
};//exports.restrictTo

//Forgot password
exports.forgotPassword = async (req,res,next) => {
    try{
        const user = await User.findOne({ email: req.body.email});
        if(!user){
            return next(new AppError('No user with that email address', 404));
        }

        const resetToken = user.generatePasswordResetToken();
        await user.save({validateBeforeSave:false});

        //Send this password reset url to user email
        const resetURL = `${req.protocol}://${req.get('host')}/users/resetPassword/${resetToken}`;

        const message = `Forgot your password? Submit a request for a new pass word with this link: ${resetURL}`;

        try{
            await sendEmail({
                email: user.email,
                subject: 'Your password reset token(valid for 10 minutes)',
                message
            });
    
            res.status(200).json({
                status: 'success',
                message: 'Token sent to the email!'
            });
        }
        catch(err){
            res.status(404).json({
                status: 'fail',
                message:err
            });
        }
        

    }//try

    catch(err){
        user.generatePasswordResetToken = undefined;
        user.passwordResetExpiresIn = undefined;
        await user.save({validateBeforeSave:false});

        return next(new AppError('There was an error sending email, try again later'),500);
    } 
    

};//exports.forgotPassword

exports.resetPassword = async (req,res,next) => {
    //Get user based on the token and encrypt
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
        //Make sure token has not expired
        passwordResetToken: hashedToken, passwordResetExpiresIn:{ $gt:Date.now() }
    });
    //If token has not expired and the user exists, set new password
    if(!user){
        return next(new AppError('Token invalid or expired', 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.generatePasswordResetToken = undefined;
    user.passwordResetExpiresIn = undefined;
    await user.save();

    const token = signToken(user._id);
        res.status(200).json({
            status: 'success',
            token
        });
};//exports.resetPassword