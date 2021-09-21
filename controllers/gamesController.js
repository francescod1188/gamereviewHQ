const axios = require('axios');
const Game = require('./../models/gameModel');


exports.getAllGames = async(req,res,next) => {
    try{
        const games = await Game.find();
        //console.log(games);
        res.status(200).json({
            status: 'success',
            results:games.length,
            data:{
                games
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

exports.addGame = async(req,res,next) => {
    try{
        const newGame = await Game.create(req.body);

        res.status(200).json({
            status: 'success',
            data:{
                game: newGame
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

exports.setGameUserIds = async(req,res,next) => {
    try{
        var gameUrl = 'https://api.rawg.io/api/games/'+ req.params.id + '?key=4bb6861b32514c34839e293722417666';
        //console.log(gameUrl);
        var config = {
            method: 'get',
            url: gameUrl,
            headers: {
                '4bb6861b32514c34839e293722417666': '',
                'Cookie': '__cfduid=d4e1efff2ec416a09ca8fe6e857c842791615827446'
            }
        };
        axios(config)
        .then(function (response) {
        
            req.body.gameId = req.params.id;
            req.body.gameTitle = response.data.name;
            req.body.gameImage = response.data.background_image;
            req.body.user = req.user.id;
            req.body.username = req.user.username;
            //console.log(req.params.id);
            next();
        });
        
    }
    catch(err){
        res.status(404).json({
            status: 'fail',
            message:err
        });
    }
};