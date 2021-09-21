const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({

    gameId:{
        type:Number,
        required:true
    },

    gameTitle:{
      type:String,
      required:true
    },

    gameImage:{
      type:String,
      required:true
    },

    user:{
      type:mongoose.Schema.ObjectId,
      ref: 'User',
      required:true

    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;