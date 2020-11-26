const express = require('express');
const mainController = require('../controllers/mainController');
const isAuth = require('../middlewares/isAuth');
// const redirectTo = require('../middlewares/redirectTo');

const router = express.Router();
router.get('/', mainController.getHome);
router.get('/center', mainController.getCenter);
router.get('/center/:centerId', isAuth, mainController.getOneCenter);

router.post('/submitCenter',mainController.postCenter);

//signup /register/ /booking  ke routes likh de
router.get('/signup', mainController.getSignup);
router.get('/register', mainController.getRegistered);
router.get('/booking', mainController.getAppt);
router.get('/booked', mainController.getBooked);

router.post('/appoint', mainController.postTicket);
router.post('/submitCenter',mainController.postCenter);


module.exports = router;
