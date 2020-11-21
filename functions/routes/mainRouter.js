const express = require('express');
const mainController = require('../controllers/mainController');
// const isAuth = require('../middlewares/isAuth');
// const redirectTo = require('../middlewares/redirectTo');

const router = express.Router();

router.get('/', mainController.getHome);




module.exports = router;