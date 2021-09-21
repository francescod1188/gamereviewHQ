//Wishlist routes
const express = require('express');

const wishController = require('./../controllers/wishController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.route('/mywishlist').get(wishController.getWishlist);

router.route('/:id/addWish').post(authController.protect,wishController.setWishUserIds, wishController.addWish);
module.exports = router;