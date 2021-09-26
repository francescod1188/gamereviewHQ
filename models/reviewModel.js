//Review model
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    reviewSummary:{
        type: String,
        required:[true, 'Review can not be empty!']
    },
    reviewHeader:{
        type:String,
        required:true
    },
    gameplayScore:{
        type:Number,
        min:1,
        max:10,
        required:true
    },
    graphicsScore:{
        type:Number,
        min:1,
        max:10,
        required:true
    },
    storyScore:{
        type:Number,
        min:1,
        max:10
    },
    audioScore:{
        type:Number,
        min:1,
        max:10
    },
    performanceScore:{
        type:Number,
        min:1,
        max:10,
        required:true
    },
    timePlayed:{
        type:Number,
        required:true
    },
    
    createdAt: {
        type:Date,
        default:Date.now("<YYYY-mm-dd>")
    },
    gameId:{
        type:Number,
        required:true
    },
    gameTitle:{
        type:String,
        required:true
    },
    gameImage:{
        type:String
    },
    
    user:{
        type: mongoose.Schema.ObjectId,
        ref:'User',
        required:[true,'Review must have an author']
    },

    username:{
        type:String,
        required:true
    }
},
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

reviewSchema.index({gameId: 1, user: 1},{unique: true});
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;