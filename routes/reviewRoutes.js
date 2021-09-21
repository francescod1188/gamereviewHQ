const reviewController = require('./../controllers/reviewController');
const express = require('express');
const authController = require('./../controllers/authController');
const router = express.Router();

router.route('/')
    .get(reviewController.getAllReviews);

router.post('/:id/createreview',authController.protect,reviewController.setUserIds,reviewController.createReview);

router.route('/:id')
    .get(reviewController.getReview)
    .patch(reviewController.updateReview);

router.route('/:id/delete')
    .delete(reviewController.deleteReview);
module.exports = router;