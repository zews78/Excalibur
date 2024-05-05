const express = require('express');
const mainController = require('../controllers/mainController');
const isAuth = require('../middlewares/isAuth');
// const redirectTo = require('../middlewares/redirectTo');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = express.Router();
router.get('/', mainController.getHome);
router.get('/center', mainController.getCenter);
router.get('/center/:centerId', isAuth, mainController.getOneCenter);
router.get('/center/centerEymployees/:centerId', isAuth, mainController.getOneCenterEymplyees);
router.post('/center/centerEymployees/ticketId/:centerId', isAuth, mainController.getOneCenterEymplyeesTicketId);
router.post('/submitCenter', upload.single("img") ,mainController.postCenter);
//signup /register/ /booking  ke routes likh de
router.get('/signup', mainController.getSignup);
router.get('/register', mainController.getRegistered);
router.get('/booking', mainController.getAppt);
router.get('/booked/:bookingId', mainController.getBooked);

router.post('/appointment', mainController.postTicket);
// router.post('/submitCenter',mainController.postCenter);


module.exports = router;
