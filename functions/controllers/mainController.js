

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
		var req_dept = [];

		// const getItems = (x, callback) => {
		// 	let itemRefs = x.map(id => {
		// 	  return firebase.firestore().collection('departments').doc(id).get();
		// 	});
		// 	Promise.all(itemRefs)
		// 	.then(docs => {
		// 	  let items = docs.map(doc => doc.data());
		// 	  callback(items);

		// 	})
		// 	.catch(error => console.log(error))
		// }

		// getItems(dept, items => {
		// 	// console.log(items);
		// 	req_dept.push(items);
		// 	// return items;
			
		// });
		// console.log(xdept);;


		// const uids = ['abcde...', 'klmno...', 'wxyz...'];

		// const promises = dept.map(u => firebase.firestore().collection("departments").doc(u).get());
		// // console.log(promises);
		// Promise.all(promises).then(results => {

		// 	//results is an array of DocumentSnapshots
		// 	//use anny array method, like map or forEach      
		// 	// var i = 0;
		// 	results.map(docSnapshot =>{
		// 		console.log(docSnapshot.data());
		// 		req_dept.push(docSnapshot.data());
		// 	});
				
		// 			// console.log(docSnapshot.data());
		// 			// let dept_Data = docSnapshot.data();
		// 			// dept_Data.DeptId = dept[i];
		// 			// i++;
		// 			// docSnapshot.data()
		// 			// req_dept.push(docSnapshot.data());

	

		// 	// console.log(req_dept);
		// 	// cosnsole.log(depart);

		// 	// if (!promises.empty) {
		// 	// 	results.forEach(depart => {
		// 	// 		let deptData = depart.data();
		// 	// 		deptData.id = dept.id;
		// 	// 		req_dept.push(deptData);
		// 	// 	});
		// 	// }
		// });


		// let req_prod = [];
		// if (!reqSnapshot.empty) {
		// 	reqSnapshot.forEach(product => {
		// 		let productData = product.data();
		// 		productData.id = product.id;
		// 		req_prod.push(productData);
		// 	});
		// }


		// let Depart = [];
		// for(i=0; i< center.data().avDept.length; i++){
		// 	let dept = center.data().avDept[i];
			let reqDept = await firebase.firestore()
				.collection('departments')
				.doc(dept)
				.get();
		// 	Depart.push(reqDept.data());
		// 	console.log(Depart);
		// }
		// console.log(Depart);

		// const reqDept = await firebase.firestore()
		// 	.collection('departments')
		// 	.doc(dept)
		// 	.get();

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
			reqDept: reqDept.data(),
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

		// console.log(
		// 	{
		// 		...center.data(),

		// 		id: centreId
		// 	});
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

		const tickets= await firebase.firestore()
			.collection(ticket)
			.where('centre_uid', '==', centreId)
			.get();

		tickets.sort((a, b) => a.date - b.date);     //sorts it in ascending order
    	const ticket = await tickets.findById(req.body.ticketId) 
		const currentToken=tickets.findIndex(x => x==ticket);
		const ticketObject={
			tickets:tickets,
			currentTicket:ticket,
			token:req.body.ticketId,
		}
		console.log(ticketObject);
		res.render('main/CentreEmploy.ejs',ticketObject)
	} catch (err) {
		console.log(err);

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
				// slot: req.body.slot,
				department: req.body.Department
			});
		console.log(req.body);
		// console.log(ticket.id);
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

		qr_code = [];
		QRCode.toDataURL(req.params.bookingId, function (err, url) {
			//'url' stores the url of the generated qr code
			qr_code.push(url);
		})



		const centre = await firebase.firestore()
			.collection('centres')
			.doc(ticket.data().centre_uid)
			.get();

		const user = await firebase.firestore()
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
	// console.log({req});
	// const bucket = firebase.storage().bucket();
	// const blob = bucket.file(req.file.originalname);
	// const blobStream = blob.createWriteStream();
  
	// blobStream.on('error', err => {
	//   console.error(err);
	//   res.status(500).send(err);
	// });
  
	// blobStream.on('finish', async () => {
	//   const publicUrl = format(
	// 	`https://storage.googleapis.com/${bucket.name}/${blob.name}`
	//   );
	try {
		// console.log(req);
		// const auth = (await isAuth(req))[0];
		const centerData = {};
		const images = [];
		// images.push(publicUrl);
		centerData.doamin = req.body.domain;
		centerData.centre_name = req.body.centerName;
		centerData.centre_desc = req.body.desc;
		centerData.PhoneNo = req.body.pNo;
		centerData.location = req.body.address;  // if tima bacha take this input auto matically via an Appointment for now i have added a field in the form asking for it
		/*i dont know how to store images*/
		centerData.images = req.body.img_url == '' ? req.body.img_url : JSON.parse(req.body.img_url)
		centerData.avDept = req.body.department;
		// console.log(publicUrl);
		// console.log({centerData});
		await firebase.firestore()
			.collection('centres').add(centerData);

		// let tickets = [];         //find by finding filtering tickets by center id and date

		res.redirect('/');
	} catch (err) {
		console.log(err);
		res.status(500).send(err);
	}
// 	blobStream.end(req.file.buffer);
// });
};
