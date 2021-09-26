//This is where routes to all pages are defined
//Import controllers to take actions for different pages and requests
const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');
const userController = require('../controllers/usersController');

const router = express.Router();

router.use(authController.isLoggedIn);
//Home page
router.get('/', viewsController.getOverview);
//Game page
router.get('/game/:id', viewsController.getGame);
//Create review
router.get('/reviews/:id/createreview', authController.protect, viewsController.createReviewPage);
//Search
router.get('/search/:search', viewsController.getSearch);
router.get('/search/', viewsController.getOverview);
//Sorting
router.get('/platform/:platform', viewsController.getByPlatform);
router.get('/year/:year', viewsController.getByYear);
router.get('/publisher/:publisher', viewsController.getByPublisher);
router.get('/genre/:genreId/:genre', viewsController.getByGenre);
router.get('/search/game/:id', viewsController.getGame);
router.get('/platform/game/:id', viewsController.getGame);
router.get('/year/game/:id', viewsController.getGame);
router.get('/publisher/game/:id', viewsController.getGame);
router.get('/genre/:genreId/game/:id', viewsController.getGame);
//Login and signup page
router.get('/login',viewsController.getLoginForm);
router.get('/signup',viewsController.getSignupForm);
//Forgot password
router.get('/forgotpassword',viewsController.getForgotPassword);
//Reviews
router.get('/reviews',viewsController.getAllReviews);
router.get('/reviews/myReviews',authController.protect,viewsController.myReviews);
router.get('/reviews/:id/delete',authController.protect,reviewController.deleteReview);
//My collection
router.get('/myCollection',authController.protect,viewsController.myCollection);
router.get('/myWishlist',authController.protect,viewsController.myWishlist);
router.get('/game/:id/addToWishlist', viewsController.getGame);
//Admin functions
router.get('/users/', authController.protect,authController.restrictTo('admin'),viewsController.allUsers);
router.get('/users/:id/delete', authController.protect,authController.restrictTo('admin'),userController.deleteUser);
//Upcoming games
router.get('/upcoming', viewsController.getUpcoming);
router.get('/upcoming-game/:id', viewsController.getUpcomingGame);





module.exports = router;