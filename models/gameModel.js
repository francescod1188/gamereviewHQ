const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({

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

gameSchema.index({gameId: 1, user: 1},{unique: true});
const Game = mongoose.model('Game', gameSchema);

module.exports = Game;