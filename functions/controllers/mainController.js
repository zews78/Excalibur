const { request } = require('express');
const firebase = require('../firebase');
const isAuth = require('../utils/isAuth');
const QRCode = require('qrcode');

// const keywordGenerator = require('../utils/keywordGenerator');


exports.getCenter = async (req, res) => {
	// const auth = (await isAuth(req))[0];
	try {
		const auth = (await isAuth(req))[0];

		var Cntr = [];
		const CntrRef = firebase.firestore()
			.collection('centres')
		const snapshot = await CntrRef.get();
		snapshot.forEach(doc => {
			Cntr.push({
				id: doc.id,
				...doc.data()
			});
		});
		// console.log(Cntr);
		res.render('main/Center-list-user-logged-in.ejs', {
			auth,
			pageTitle: 'Center-list',
			Cntr
		});
	} catch (err) {
		console.log(err);
	}
};


// exports.getHelp = async(req, res) => {
// 	try {
// 		const auth = (await isAuth(req))[0];

// 		var Cntr = [];
// 		const CntrRef = firebase.firestore()
// 			.collection('centres')
// 		const snapshot = await CntrRef.get();
// 		snapshot.forEach(doc => {
// 			Cntr.push({
// 				id: doc.id,
// 				...doc.data()
// 			});
// 		});
// 		console.log(Cntr);
// 		res.render('main/home.ejs', {
// 			pageTitle: 'Home',
// 			Cntr
// 		});
// 	} catch (err) {
// 		console.log(err);
// 	}
// };
exports.getHome = async (req, res) => {
	try {
		const auth = (await isAuth(req))[0];

		// var Cntr = [];
		// const CntrRef = firebase.firestore()
		// 	.collection('centres')
		// const snapshot = await CntrRef.get();
		// snapshot.forEach(doc => {
		// 	Cntr.push({
		// 		id: doc.id,
		// 		...doc.data()
		// 	});
		// });
		// console.log(Cntr);
		res.render('main/home.ejs', {
			pageTitle: 'Home',
			auth
			// Cntr
		});
	} catch (err) {
		console.log(err);
	}
};

exports.getOneCenter = async (req, res) => {
	try {
		const auth = (await isAuth(req))[0];
		const centreId = req.params.centerId;
		const center = await firebase.firestore()
			.collection('centres')
			.doc(req.params.centerId)
			.get();

		// console.log(typeof JSON.parse(dept));
		const userId = req.uid;
		const reqUser = await firebase.firestore()
			.collection('users')
			.doc(req.uid)
			.get();
		// console.log(userId);
		let dept = center.data().avDept[0];


		// let Depart = [];
		// for(i=0; i< center.data().avDept.length; i++){
		// 	let dept = center.data().avDept[i];
		// 	let reqDept = await firebase.firestore()
		// 		.collection('departments')
		// 		.doc(dept)
		// 		.get();
		// 	Depart.push(reqDept.data());
		// 	console.log(Depart);
		// }
		// console.log(Depart);
		const reqDept = await firebase.firestore()
			.collection('departments')
			.doc(dept)
			.get();

		// console.log(reqDept.data());
		// console.log(center.data().avDept[0]);


		// 	reqDept.forEach(product => {
		// 		let productData = product.data();
		// 		productData.id = product.id;
		// 		dept.push(productData);
		// 	});
		console.log(
			{
				...center.data(),
				userId: userId,
				id: centreId
			});
		// console.log(reqDept.data());
		// console.log(req.params.centerId);

		res.render('main/Centre_Details_booking.ejs', {
			cntr_data: {
				...center.data(),
				userId,
				id: centreId
			},
			dept_data: {
				...reqDept.data(),
				deptId: dept
			},
			pageTitle: 'Centre-List',
			auth

		});
	} catch (err) {
		console.log(err);
	}
};

exports.getOneCenterEymplyees = async (req, res) => {
	try {
		const auth = (await isAuth(req))[0];
		const centreId = req.params.centerId;
		const center = await firebase.firestore()
			.collection('centres')
			.doc(req.params.centerId)
			.get();

		console.log(
			{
				...center.data(),

				id: centreId
			});
		// console.log(reqDept.data());
		// console.log(req.params.centerId);

		res.render('main/input-id.ejs', {
			center: {
				...center.data(),
				id: centreId
			},
			pageTitle: 'enter ticket id',
		});
	} catch (err) {
		console.log(err);
	}
};
exports.getOneCenterEymplyeesTicketId =async (req,res)=>{
	try {
		const centreId = req.params.centerId;

		const tickets=await Ticket.find({centre_uid:centreId});
		tickets.sort((a, b) => a.date - b.date);     //sorts it in ascending order
    const ticket=await Ticket.findById(req.params.ticketId)
		const ticketObject={
			tickets:tickets,
			currentTicket:ticket,
		}
		res.render('main/CentreEmploy.ejs',ticketObject)
	} catch (e) {

	}
}

exports.postTicket = async (req, res) => {

	try {
		console.log(req.uid);
		const ticket = await firebase.firestore()
			.collection('ticket')
			.add({
				userId: req.body.userId,
				// centre_name: req.body.centre_name,
				centre_uid: req.body.centreId,
				date: req.body.date,
				slot: req.body.slot
			});
		console.log(req.body);
		console.log(ticket.id);
		res.redirect('/booked/' + ticket.id);
	} catch (err) {
		console.log(err);
	}

};



exports.getSignup = async (req, res) => {

	const auth = (await isAuth(req))[0];

	res.render('main/signup.ejs', {
		pageTitle: 'Signup',
		auth

	});
};

exports.getRegistered = async (req, res) => {
	const auth = (await isAuth(req))[0];

	res.render('main/center-registeration-form.ejs', {
		pageTitle: 'Register',
		auth

	});
};

exports.getAppt = async (req, res) => {
	const auth = (await isAuth(req))[0];

	res.render('main/booking.ejs', {
		pageTitle: 'Appointment',
		auth

	});
};

exports.getBooked = async (req, res) => {
	try {
		const auth = (await isAuth(req))[0];

		const ticket = await firebase.firestore()
			.collection('ticket')
			.doc(req.params.bookingId)
			.get();

		// below is the code to generate a qr code

		qr_code=[];
		QRCode.toDataURL(req.params.bookingId, function (err, url) {
			console.log(url);        //'url' stores the url of the generated qr code
			qr_code.push(url);
		})



		const centre = await firebase.firestore()
			.collection('centres')
			.doc(ticket.data().centre_uid)
			.get();

		const user= await firebase.firestore()
			.collection('users')
			.doc(ticket.data().userId)
			.get();


		// console.log(ticket.data());
		// console.log(centre.data().centre_name);

		res.render('main/Delta/booking-confirmation.ejs', {
			ticket_data: {
				...ticket.data(),
				img_url: qr_code[0],
				ticketId: req.params.bookingId,
				centreName: centre.data().centre_name,
				userName: user.data().name
			},
			pageTitle: 'Booking Confirmed',
			auth

		});
	} catch (err) {
		console.log(err);
	}
};

exports.postCenter = async (req, res) => {
	try {
		const auth = (await isAuth(req))[0];
		const centerData = {};
		const images=[];
		images.push(req.body.img);
		centerData.doamin = req.body.domain;
		centerData.centre_name = req.body.centerName;
		centerData.centre_desc = req.body.desc;
		centerData.PhoneNo = req.body.pNo;
		centerData.location = req.body.address;  // if tima bacha take this input auto matically via an Appointment for now i have added a field in the form asking for it
	 /*i dont know how to store images*/
	 centerData.images  =['https://firebasestorage.googleapis.com/v0/b/excelerentum.appspot.com/o/geetanjali_salon.jpg?alt=media&token=9640d38e-51b7-47b5-9591-98d09e5ea9c7'];
		centerData.avDept= req.body.department;

	await	firebase.firestore()
			.collection('centres').add(centerData);

let tickets=[];         //find by finding filtering tickets by center id and date

			res.render('main/CentreEmploy.ejs', {
				center:centerData,
				tickets:tickets,
			});
	} catch (err) {
		console.log(err);
	}
}
