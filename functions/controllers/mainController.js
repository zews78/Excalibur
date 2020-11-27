const firebase = require('../firebase');
const isAuth = require('../utils/isAuth');
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

		const dept = center.data().avDept[0];
		// console.log(typeof JSON.parse(dept));
		const userId = req.uid;
		const reqUser = await firebase.firestore()
			.collection('users')
			.doc(req.uid)
			.get();
		// console.log(userId);

		// let dept = [];
		const reqDept = await firebase.firestore()
			.collection('departments')
			.doc(dept)
			.get();

		console.log(reqDept.data());
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

exports.postTicket = async (req, res) => {

	try {
     console.log(req.uid);
		await firebase.firestore()
			.collection('ticket')
			.add({
				userId: req.body.userId,
				// centre_name: req.body.centre_name,
				centre_uid: req.body.centreId,
				date: req.body.date,
				slot: req.body.slot
			});
		console.log(req.body);
		res.redirect('/booked');
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
	const auth = (await isAuth(req))[0];

	res.render('main/Delta/booking-confirmation.ejs', {
		pageTitle: 'Booking Confirmed',
		auth

	});
};
exports.postCenter = async (req, res) => {
	try {
		const auth = (await isAuth(req))[0];
		const centerData = {};
		centerData.doamin = req.body.domain;
		centerData.centre_name = req.body.centerName;
		centerData.centre_desc = req.body.desc;
		centerData.PhoneNo = req.body.pNo;
		centerData.location = req.body.address;  // take this input auto matically via an Appointment for now i have added a field in the form asking for it
		// centerData.images  =wil store the file uploaded
		//centerData.avDept= req.body.department; //will store the available departments

		firebase.firestore()
			.collection('centres').add(centerData);

		//	res.redirect('main/Center-list-user-logged-in.ejs');  //I want to redirect to this page but its not working
	} catch (err) {
		console.log(err);
	}
}
