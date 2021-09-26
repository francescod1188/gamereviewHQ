//User creation and functionality
const User = require('./../models/userModel');
const handler = require('./handlers');

exports.getAllUsers = async (req,res,next) => {
    try{
        const users = await User.find();
        res.status(200).json({
            status:'success',
            results:users.length,
            data:{
                users
            }
        })

    }
    catch(err){
        res.status(404).json({
            status: 'fail',
            message:err
        });
    }
};//exports.getAllUsers

exports.getUser = handler.getOne(User);

exports.updateUser = handler.updateOne(User);

//Delete my account
exports.deleteMe = async(req,res,next) => {
    try{
        await User.findByIdAndDelete(req.user.id,{active:false});

        res.status(204).json({
            status:'success',
            data:null
        });
    }//try
    catch(err){
        res.status(404).json({
            status: 'fail',
            message:err
        });
    }
};//exports.deleteMe

exports.getMe = (req,res,next) => {
    req.params.id = req.user.id;
    next();
}

exports.deleteUser = handler.deleteOne(User);
