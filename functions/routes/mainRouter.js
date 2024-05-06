const express = require('express');
const mainController = require('../controllers/mainController');
const isAuth = require('../middlewares/isAuth');
// const redirectTo = require('../middlewares/redirectTo');

const router = express.Router();
router.get('/', mainController.getHome);
router.get('/center', mainController.getCenter);
router.get('/center/:centerId', isAuth, mainController.getOneCenter);
router.get('/center/centerEymployees/:centerId', isAuth, mainController.getOneCenterEymplyees);
router.post('/center/centerEymployees/ticketId/:centerId', isAuth, mainController.getOneCenterEymplyeesTicketId);
router.post('/submitCenter', mainController.postCenter);
router.get('/signup', mainController.getSignup);
router.get('/register', mainController.getRegistered);
router.post('/create-category', mainController.postCategory);

router.get('/booking', mainController.getAppt);
router.get('/booked/:bookingId', mainController.getBooked);

router.post('/appointment', mainController.postTicket);
router.post('/submitCenter', mainController.postCenter);
router.post('/availableSlots',mainController.postAvailableSlots);

router.post('/signup/:uid', isAuth, mainController.postUser);
router.post('/cancelAppointment',isAuth,mainController.deleteTicket);
router.post('/stopQueue',isAuth,mainController.stopQueue);
router.post('/restartQueue',isAuth,mainController.restartQueue);



module.exports = router;
