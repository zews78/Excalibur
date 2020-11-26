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
		// const reqUser = await firebase.firestore()
		// 	.collection('users')
		// 	.doc(requirement.data().uid)
		// 	.get();
		console.log({...center.data(), centreId});
		// console.log(req.params.centerId);

		res.render('main/Centre_Details_booking.ejs', {
			cntr_data: {
				...center.data(),
				id: centreId
			},
			pageTitle: 'Centre',
			auth

		});
	} catch (err) {
		console.log(err);
	}
};

exports.postCenter=async (req,res)=>{
	try {
		const centerData = {};
		centerData.doamin = req.body.domain;
		centerData.centre_name=req.body.centerName;
		centerData.centre_desc=req.body.desc;
		centerData.PhoneNo='9112586789';
		centerData.location='Ambala,Haryana'
		centerData.avDept[0]='FrZs8ud9tetYTH00SXR';
		centerData.images[0]='https://firebasestorage.googleapis.com/v0/b/excelerentum.appspot.com/o/munjals-complete-dental-care-ambala-uuoey.jpg?alt=media&token=03ee1f8c-bb8d-41a6-9774-ea6ab4ab104b';
				firebase.firestore()
				.collection('centres')
				.doc('b4AfGEhn17rnIlrJqHeL');
				.set(centerData);
	} catch (err) {
		console.log(err);
	}
}
