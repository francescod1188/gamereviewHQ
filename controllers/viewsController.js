//This file is where all API requests are made as well as where pages are rendered
const gamesController = require('./../controllers/gamesController');
const reviewController = require('./../controllers/reviewController');
const userController = require('./../controllers/usersController');
const axios = require('axios');
const Review = require('./../models/reviewModel');
const User = require('./../models/userModel');
const Game = require('./../models/gameModel');
const Wishlist = require('./../models/wishlistModel');
//187 = PS5
//18 = PS4
//7 = Nintendo Switch
//1 = Xbox One
//186 = Series X
// Upcoming 'https://api.rawg.io/api/games?key=4bb6861b32514c34839e293722417666&dates=2021-07-15,2021-12-31&ordering=-added'

var gameUrl = 'https://api.rawg.io/api/games?key=4bb6861b32514c34839e293722417666&dates=2021-03-01,2021-06-30';
console.log(gameUrl);
//Home page
exports.getOverview = (req,res) => {
        //Make api request to get top games
        var gameUrl = 'https://api.rawg.io/api/games?key=4bb6861b32514c34839e293722417666&dates=2021-01-01,2021-09-15';
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
            const data = JSON.stringify(response.data.results);
            //JSON list of games
            const games = JSON.parse(data);
            //Render page and use games data
            res.status(200).render('overview', {
                title: 'Most Popular',
                games
            });
        });
}

exports.getUpcoming = (req,res) => {
    //Make api request to get upcoming games
    var gameUrl = 'https://api.rawg.io/api/games?key=4bb6861b32514c34839e293722417666&dates=2021-10-01,2022-12-31';
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
        const data = JSON.stringify(response.data.results);
        //JSON list of games
        const games = JSON.parse(data);

        res.status(200).render('upcoming', {
            title: 'Upcoming Games',
            games
        });
    });
}

//Get info page for 1 game
exports.getGame = async(req,res) => {
    try{
        //Get game infor and creenshots from api
        const requestOne = axios.get('https://api.rawg.io/api/games/'+ req.params.id + '?key=4bb6861b32514c34839e293722417666');
        const requestTwo = axios.get('https://api.rawg.io/api/games/'+ req.params.id + '/screenshots?key=4bb6861b32514c34839e293722417666');

        
        axios.all([requestOne, requestTwo]).then(axios.spread(async(...responses) => {
            //Game info
            const data = JSON.stringify(responses[0].data);
            //Game screenshots
            const data2 = JSON.stringify(responses[1].data);
            const game = JSON.parse(data);
            const screenshots = JSON.parse(data2);
            //Get reviews for this game
            const reviews = await Review.find({gameId:game.id}).sort({_id:-1});
            //(game);
            //console.log(screenshots);
            res.status(200).render('game', {
                title: game.name,
                reviews,
                game,
                screenshots
            });
        }));
    }
    catch(err){
        res.status(404).json({
            status: 'fail',
            message:err
        });
    }
    
};
//Upcoming games
exports.getUpcomingGame = async(req,res) => {
    try{
        //Get game infor and creenshots from api
        const requestOne = axios.get('https://api.rawg.io/api/games/'+ req.params.id + '?key=4bb6861b32514c34839e293722417666');
        const requestTwo = axios.get('https://api.rawg.io/api/games/'+ req.params.id + '/screenshots?key=4bb6861b32514c34839e293722417666');

        
        axios.all([requestOne, requestTwo]).then(axios.spread(async(...responses) => {
            //Game info
            const data = JSON.stringify(responses[0].data);
            //Game screenshots
            const data2 = JSON.stringify(responses[1].data);
            const game = JSON.parse(data);
            const screenshots = JSON.parse(data2);
            //console.log(game);
            //console.log(screenshots);
            res.status(200).render('upcomingGame', {
                title: game.name,
                game,
                screenshots
            });
        }));
    }
    catch(err){
        res.status(404).json({
            status: 'fail',
            message:err
        });
    }
    
};

//Get my game reviews
exports.myReviews = async(req,res,next) => {
    try{
        //Find reviews for current user
        const reviews = await Review.find({user:req.user.id}).sort({_id:-1});
        res.status(200).render('myReviews',{
            title: 'My Reviews',
            reviews
        });
    }
    catch(err){
        res.status(404).json({
            status: 'fail',
            message:err
        });
    }
    
};

//Get my game reviews
exports.allUsers = async(req,res,next) => {
    try{
        const users = await User.find().sort({_id:-1});
        res.status(200).render('allUsers',{
            title: 'All Users',
            users
        });
    }
    catch(err){
        res.status(404).json({
            status: 'fail',
            message:err
        });
    }  
};

//Get my games collection
exports.myCollection = async(req,res,next) => {
    try{
        //Find games in current users collection
        const games = await Game.find({user:req.user.id}).sort({gameTitle:1});
        res.status(200).render('myCollection',{
            title: 'My Collection',
            games
        });
    }
    catch(err){
        res.status(404).json({
            status: 'fail',
            message:err
        });
    }
    
};

//Get my games wishlist
exports.myWishlist = async(req,res,next) => {
    try{
        const myWishlist = await Wishlist.find({user:req.user.id}).sort({gameTitle:1});
        res.status(200).render('myWishlist',{
            title: 'My Wishlist',
            myWishlist
        });
    }
    catch(err){
        res.status(404).json({
            status: 'fail',
            message:err
        });
    }
    
};

//Create review page
exports.createReviewPage = (req,res) => {
    try{
        gameUrl = 'https://api.rawg.io/api/games/'+ req.params.id + '?key=4bb6861b32514c34839e293722417666';
        var config = {
          method: 'get',
          url: gameUrl,
          headers: {
            '4bb6861b32514c34839e293722417666': '',
            'Cookie': '__cfduid=d4e1efff2ec416a09ca8fe6e857c842791615827446'
          }
        };

    axios(config)
    .then(async function (response) {
        const data = JSON.stringify(response.data);
        const game = JSON.parse(data);
        //(req.params.id);
        res.status(200).render('createReview', {
            title: 'Create Review for ' + game.name,
            game
        });
    });
    }
    catch(err){
        res.status(404).json({
            status: 'fail',
            message:err
        });
    }
    
};
//Search for a game
exports.getSearch = (req,res) => {
    //Append search query to api request
    gameUrl = 'https://api.rawg.io/api/games?key=4bb6861b32514c34839e293722417666&search=' + req.params.search;
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
        const data = JSON.stringify(response.data.results);
        const games = JSON.parse(data);
        const search = req.params.search;
        res.status(200).render('search', {
            title: 'Search for ' + search,
            search,
            games
        });
    });
};//exports.searchGames

//Sort game by platform
//A different url API request must be made for each console as they all have different ranges for games
exports.getByPlatform = (req,res) => {
    //console.log(req.params.platform);
    //Make api request to find games from a specific platform
    if(req.params.platform == "PS5"){
        gameUrl = 'https://api.rawg.io/api/games?key=4bb6861b32514c34839e293722417666&platforms=187&&publishers=11687&dates=2020-11-12,2021-09-14'
    }
    else if(req.params.platform == "Xbox Series X"){
        gameUrl = 'https://api.rawg.io/api/games?key=4bb6861b32514c34839e293722417666&publishers=20987&dates=2018-01-01,2021-08-30'
    }
    else if(req.params.platform == "Nintendo Switch"){
        gameUrl = 'https://api.rawg.io/api/games?key=4bb6861b32514c34839e293722417666&publishers=10681&dates=2017-03-03,2021-08-30'
    }
    else if(req.params.platform == "PS4"){
        gameUrl = 'https://api.rawg.io/api/games?key=4bb6861b32514c34839e293722417666&platforms=18&publishers=10212,11687&dates=2013-11-12,2020-11-10'
    }
    else if(req.params.platform == "Wii U"){
        gameUrl = 'https://api.rawg.io/api/games?key=4bb6861b32514c34839e293722417666&publishers=10681&platform=10&dates=2012-11-18,2017-03-03'
    }
    else if(req.params.platform == "PS3"){
        gameUrl = 'https://api.rawg.io/api/games?key=4bb6861b32514c34839e293722417666&platforms=16&publishers=10212&dates=2007-10-01,2013-12-10'
    }
    else if(req.params.platform == "Xbox 360"){
        gameUrl = 'https://api.rawg.io/api/games?key=4bb6861b32514c34839e293722417666&platform=14&publishers=20987&dates=2005-11-22,2013-11-10'
    }
    else if(req.params.platform == "Wii"){
        gameUrl = 'https://api.rawg.io/api/games?key=4bb6861b32514c34839e293722417666&publishers=10681&platforms=11&dates=2006-11-18,2012-11-17'
    }
    else if(req.params.platform == "DS"){
        gameUrl = 'https://api.rawg.io/api/games?key=4bb6861b32514c34839e293722417666&publishers=10681&platforms=9&dates=2004-11-21,2011-03-26'
    }
    else if(req.params.platform == "PS2"){
        gameUrl = 'https://api.rawg.io/api/games?key=4bb6861b32514c34839e293722417666&platforms=15&publishers=10212&dates=2000-03-04,2007-12-31'
    }
    else if(req.params.platform == "Original Xbox"){
        gameUrl = 'https://api.rawg.io/api/games?key=4bb6861b32514c34839e293722417666&platform=80&dates=2001-11-15,2005-11-22'
    }
    else if(req.params.platform == "PS Vita"){
        gameUrl = 'https://api.rawg.io/api/games?key=4bb6861b32514c34839e293722417666&publishers=10212&platforms=19&dates=2011-12-17,2020-12-31'
    }
    else if(req.params.platform == "GameCube"){
        gameUrl = 'https://api.rawg.io/api/games?key=4bb6861b32514c34839e293722417666&publishers=10681&platforms=105&dates=2001-09-14,2006-12-31'
    }
    else if(req.params.platform == "PS1"){
        gameUrl = 'https://api.rawg.io/api/games?key=4bb6861b32514c34839e293722417666&platforms=27&publishers=10212'
    }
    else if(req.params.platform == "Nintendo 64"){
        gameUrl = 'https://api.rawg.io/api/games?key=4bb6861b32514c34839e293722417666&publishers=10681&platforms=83'
    }

    //9 = Nintendo DS
    //15 = PS2
    //27 = PS1
    //16 = PS3
    //18 = PS4
    //11 = Wii
    //10 = Wii U
    //105 = Gamecube
    //14 = Xbox 360
    //80 = Xbox
    //17 = PSP
    //10212 = Old Sony Games
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
        const data = JSON.stringify(response.data.results);
        const games = JSON.parse(data);
        const platform = req.params.platform;
        res.status(200).render('platforms', {
            title: 'Top ' + platform + ' Games',
            platform,
            games
        });
    });
};

//Sort by release year
exports.getByYear = (req,res) => {
    //console.log(req.params.year);
    //Append release year to api request
    gameUrl = 'https://api.rawg.io/api/games?key=4bb6861b32514c34839e293722417666&dates='+ req.params.year + '-01-01,' + req.params.year + '-12-31'

        
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
        const data = JSON.stringify(response.data.results);
        const games = JSON.parse(data);
        const year = req.params.year;
        res.status(200).render('year', {
            title: 'Top ' + year + ' Games',
            year,
            games
        });
    });
};
//Sort by genre
exports.getByGenre = (req,res) => {

    gameUrl = 'https://api.rawg.io/api/games?key=4bb6861b32514c34839e293722417666&genres='+ req.params.genreId + '&dates=2016-01-01,2021-09-06'

        
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
        const data = JSON.stringify(response.data.results);
        const games = JSON.parse(data);
        const genre = req.params.genre;
        res.status(200).render('genres', {
            title: 'Top ' + genre + ' Games',
            genre,
            games
        });
    });
};
//Sort by publisher
exports.getByPublisher = (req,res) => {


    if(req.params.publisher == "Activision"){
        gameUrl = 'https://api.rawg.io/api/games?key=4bb6861b32514c34839e293722417666&publishers=10830'
    }
    else if(req.params.publisher == "EA"){
        gameUrl = 'https://api.rawg.io/api/games?key=4bb6861b32514c34839e293722417666&publishers=354'
    }
    else if(req.params.publisher == "Ubisoft"){
        gameUrl = 'https://api.rawg.io/api/games?key=4bb6861b32514c34839e293722417666&publishers=918'
    }
    else if(req.params.publisher == "Bethesda"){
        gameUrl = 'https://api.rawg.io/api/games?key=4bb6861b32514c34839e293722417666&publishers=339'
    }
    else if(req.params.publisher == "2K"){
        gameUrl = 'https://api.rawg.io/api/games?key=4bb6861b32514c34839e293722417666&publishers=358'
    }

        
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
        const data = JSON.stringify(response.data.results);
        const games = JSON.parse(data);
        const publisher = req.params.publisher;
        res.status(200).render('publisher', {
            title: 'Top ' + publisher + ' Games',
            publisher,
            games
        });
    });
};

//Get latest game reviews
exports.getAllReviews = async(req,res,next) => {
    try{
        const reviews = await Review.find().sort({_id:-1});
        //console.log(reviews);
        res.status(200).render('allReviews',{
            title: 'Latest Reviews',
            reviews
        });
        
    }
    catch(err){
        res.status(404).json({
            status: 'fail',
            message:err
        });
    }
};

exports.getLoginForm = (req,res) => {
    res.status(200).render('login', {
        title:'Log into your account'
    })
}

exports.getForgotPassword = (req,res) => {
    res.status(200).render('forgotPassword', {
        title:'Forgot Password?'
    })
}

exports.getSignupForm = (req,res) => {
    res.status(200).render('signup', {
        title:'Sign Up!!!'
    })
}