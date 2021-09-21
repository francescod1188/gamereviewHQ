//GAME ROUTES 
const express = require('express');
const viewsController = require('../controllers/viewsController');
const gamesController = require('./../controllers/gamesController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.route('/mygames').get(gamesController.getAllGames);

router.route('/:id/addgame').post(authController.protect,gamesController.setGameUserIds, gamesController.addGame,viewsController.myCollection);
module.exports = router;