const {request} = require('express');
const firebase = require('../firebase');
const isAuth = require('../utils/isAuth');
const QRCode = require('qrcode');
const update = require('../utils/update');
const { getSessions } = require('../utils/time');

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
    let dept = center.data().avDept;
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

    // getItems(dept, items =>{
    // 	// req_dept.push(items);
    // 	req_dept = items;
    // 	console.log(items, "hello");
    // });
    // setTimeout(()=>{
    // 	console.log(req_dept, "pleeeeeezze"), 15000
    // })
    // console.log(getItems(dept, items));

    // getItems(dept, items => {
    // 	// console.log(items);
    // 	req_dept.push(items);
    // 	// return items;

    // });
    // console.log(xdept);;


    // const uids = ['abcde...', 'klmno...', 'wxyz...'];

    const promises = dept.map(u => firebase.firestore().collection("departments").doc(u).get());
    // const promises = await firebase.firestore()
    // 	.collection('departments')
    // 	.doc(dept)
    // 	.get()
    // 	.then(function(querySnapshot) {
    // 		querySnapshot.forEach(function(doc) {
    // 			// doc.data() is never undefined for query doc snapshots
    // 			console.log(doc.id, " => ", doc.data());
    // 		});
    // 	})

    // promises.map(docSnapshot =>{
    // 	// req_dept.push(docSnapshot.data());
    // 	console.log(docSnapshot);
    // })
    // console.log(promises);
    // function getAllItems()
    // console.log(promises.data());
    var results = await Promise.all(promises);
    results.map(docSnapshot => {
      req_dept.push(docSnapshot.data());
      // console.log(docSnapshot.data(), "shiit");
    });

    // setTimeout(()=>{
    // 	console.log(req_dept, 'pleeeeeeease');
    // })



    console.log({
      ...center.data(),
      userId: userId,
      id: centreId
    });
    // console.log(req_dept);
    // console.log(req.params.centerId);

    res.render('main/Centre_Details_booking.ejs', {
      cntr_data: {
        ...center.data(),
        userId,
        id: centreId
      },
      reqDept: req_dept,
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

exports.getOneCenterEymplyeesTicketId = async (req, res) => {
  try {
    const centreId = req.params.centerId;

    const ticketsSnapshot = await firebase.firestore()
      .collection('ticket')
      .where('centre_uid', '==', centreId)
      // .orderBy('timestamp', 'desc')
      .get();



    const reqCentre = await firebase.firestore()
      .collection('centres')
      .doc(centreId)
      .get();


    regUsers = [];
    tickets = [];
    ticketsSnapshot.forEach(doc => {
      if (doc.data().userId) {
        regUsers.push(doc.data().userId);
        // console.log(doc.data().userId,"bolaa")
        tickets.push({
          id: doc.id,
          ...doc.data()
        });
      }
    });
    RegUsers = [];
    const promises = regUsers.map(u => firebase.firestore().collection("users").doc(u).get());
    var results = await Promise.all(promises);
    results.map(docSnapshot => {
      RegUsers.push(docSnapshot.data().name);
      // console.log(docSnapshot.data(), "shiit");
    });

    Tickets = tickets.sort((a, b) => new Date(a.date) - new Date(b.date)); //sorts it in ascending order
    // const ticket = await tickets.findById(req.body.ticketId)
    // const currentToken=tickets.findIndex(x => x==ticket);
    const ticketObject = {
      // tickets:tickets,
      // currentTicket:ticket,
      token: req.body.ticketId,
      centre_name: reqCentre.data().centre_name,
      centre_location: reqCentre.data().location
    }
    // console.log(tickets,'naah');
    console.log(Tickets, "ordered aana chaiye")
    console.log(ticketObject);
    // console.log(RegUsers);

    update(centreId, req.body.ticketId); //we are updating the centre current token using centreId and ticketId
    // console.log(req.body.ticketId);
    res.render('main/CentreEmploy.ejs', {
      Tickets,
      RegUsers,
      ticketObject
    });
  } catch (err) {
    console.log(err);

  }
}

exports.postTicket = async (req, res) => {

  try {
    console.log('post ticket',req.body.userId);
    req.body.session
    let ticket = await firebase.firestore()
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
    QRCode.toDataURL(req.params.bookingId, function(err, url) {
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

	const department = await firebase.firestore()
      .collection('departments')
      .doc(ticket.data().department)
	  .get();

    // Send Email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'debuggers.nitkkr@gmail.com',
        pass: '11915110'
      }
    });

    const mailOption = {
      from: 'no_reply@gmail.com',
      to: 'shariquealam52@gmail.com',//////Set the email ID Cannot find it
      subject: 'Appointment Booked',
      text: req.params.bookingId + 'Your Appointment is Booked With',
      html:''
    };

    transporter.sendMail(mailOption, function(err, data) {
      if (err) {
        console.log('Error' + err);
      } else {
        console.log('Message Sent!');
      }
    });
    // console.log(department.data());
    // console.log(centre.data().centre_name);

    res.render('main/Delta/booking-confirmation.ejs', {
      ticket_data: {
        ...ticket.data(),
        img_url: qr_code[0],
        ticketId: req.params.bookingId,
        centreName: centre.data().centre_name,
		userName: user.data().name,
		Department: department.data().dept_name
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
    const images = [];
    images.push(req.body.img);
    centerData.doamin = req.body.domain;
    centerData.centre_name = req.body.centerName;
    centerData.centre_desc = req.body.desc;
    centerData.PhoneNo = req.body.pNo;
    centerData.location = req.body.address; // if tima bacha take this input auto matically via an Appointment for now i have added a field in the form asking for it
    /*i dont know how to store images*/
    centerData.images = ['https://firebasestorage.googleapis.com/v0/b/excelerentum.appspot.com/o/geetanjali_salon.jpg?alt=media&token=9640d38e-51b7-47b5-9591-98d09e5ea9c7'];

    centerData.sessions=getSessions(req.body.openingTime,req.body.closingTime);
    centerData.openingTime=req.body.openingTime;
    centerData.closingTime=req.body.closingTime;

    let dData = {};
    let id;
    let department;

    centerData.avDept = [];

    for (let i = 0; i < req.body.department.length; i++) {
      department = await firebase.firestore()
        .collection('departments').doc();
      id = department.id;
      console.log(id);
      centerData.avDept.push(id);
      dData.dept_name = req.body.department[i];
      await department.set(dData);
    }

    await firebase.firestore()
      .collection('centres').add(centerData);

    let tickets = []; //find by finding filtering tickets by center id and date

    res.redirect('/');
  } catch (err) {
    console.log(err);
  }
}

exports.postUser = async (req, res) => {
  try {
    const auth = (await isAuth(req))[0];
    if (req.body.psw !== req.body.pswrepeat) {
      throw new Error('Passwords do not match');
    }
    let user = await firebase.firestore()
      .collection('users').doc(req.params.uid).get();

    let userData = {
      mobile: user.data().mobile,
    };
    userData.name = req.body.name;
    userData.password = req.body.psw;
    await firebase.firestore()
      .collection('users').doc(req.params.uid).update(userData);

    res.redirect('/');
  } catch (e) {
    console.log(e);
  }
}
