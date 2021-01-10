const express = require('express');
const userController = require('../controllers/userController');
const isAuth = require('../middlewares/isAuth');


const router = express.Router();
router.get('/profile', isAuth, userController.getUserProfile);
router.get('/:userId/profile', userController.getUserProfile);

module.exports = router;
