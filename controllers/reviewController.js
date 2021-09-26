//Review functionality
const Review = require('./../models/reviewModel');
const User = require('./../models/userModel');
const handler = require('./handlers');

exports.getAllReviews = async(req,res,next) => {
    try{
        const reviews = await Review.find();
        //console.log(reviews);
        res.status(200).json({
            status: 'success',
            results:reviews.length,
            data:{
                reviews
            }
        });
    }
    catch(err){
        res.status(404).json({
            status: 'fail',
            message:err
        });
    }
};
//Build a review using handler function
exports.createReview = async(req,res,next) => {
    try{
        const newReview = await Review.create(req.body);
        //console.log('review');
        res.status(200).json({
            status: 'success',
            data:{
                review:newReview
            }
        });
    }
    catch(err){
        res.status(404).json({
            status: 'fail',
            message:err
        });
    }
};
//Automatically assign the current user to the review being created
exports.setUserIds = (req,res,next) => {
        req.body.user = req.user.id;
        req.body.username = req.user.username;
        //console.log(req.params.id);
        next();
};

exports.getReview = handler.getOne(Review);
exports.updateReview = handler.updateOne(Review);
exports.deleteReview = handler.deleteOne(Review);