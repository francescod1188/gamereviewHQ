//USER ROUTES
const express = require('express');
const userController = require('./../controllers/usersController');
const authController = require('./../controllers/authController');
const reviewController = require('./../controllers/reviewController');
const User = require('../models/userModel');
const router = express.Router();

router.post('/signup',authController.signup);
router.post('/login',authController.login);
//No data is sent so it is a get method
router.get('/logout',authController.logout);
router.post('/forgotPassword',authController.forgotPassword);
router.patch('/resetPassword/:token',authController.resetPassword);

//me
router.get('/me', authController.protect,userController.getMe, userController.getUser);
router.delete('/deleteMe',authController.protect, userController.deleteMe);

//Admin only functions for user data
router.use(authController.protect);
router.use(authController.restrictTo('admin'));
router
    .route('/')
    .get(userController.getAllUsers);
//Single user
router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser);

router.route('/:id/delete')
    .delete(userController.deleteUser);
    


module.exports = router;
