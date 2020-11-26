const express = require('express');
const mainController = require('../controllers/mainController');
const isAuth = require('../middlewares/isAuth');
// const redirectTo = require('../middlewares/redirectTo');

const router = express.Router();
router.get('/', mainController.getHome);
router.get('/center', mainController.getCenter);
router.get('/center/:centerId', isAuth, mainController.getOneCenter);

//signup /register/ /booking  ke routes likh de

module.exports = router;
