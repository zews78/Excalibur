const firebase = require('../firebase');
const QRCode = require('qrcode');

const isAuth = require('../utils/isAuth');




exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId || req.uid;
    const userSnapshot = await firebase.firestore()
      .collection('users')
      .doc(userId)
      .get();
    console.log(userSnapshot.data());
    // if (!userSnapshot.data().name) {
    // 	res.redirect('/login');
    // } else {
    // 	if (!userSnapshot.exists) {
    // 		throw new Error('user not found');
    // 	}

    const reqTicket = await firebase.firestore()
      .collection('ticket')
      .where('userId', '==', userId)
      // .orderBy("timestamp", "desc")
      .limit(3)
      .get();
    let req_ticket = [];
    let my_centres = [];
    if (!reqTicket.empty) {
      reqTicket.forEach(ticket => {
        let ticketData = ticket.data();
        ticketData.id=ticket.id;
        my_centres.push(ticketData.centre_uid);
        req_ticket.push(ticketData);

        // ticketData.id = []
        QRCode.toDataURL(ticket.id, function(err, url) {
          //'url' stores the url of the generated qr code
          ticketData.qrcode = url;
        // qr_code.push(url, "hello");
        });
      });
    }
    myCntr = [];
    const promises = my_centres.map(u => firebase.firestore().collection("centres").doc(u).get());
    var results = await Promise.all(promises);
    results.map(docSnapshot => {
      myCntr.push(docSnapshot.data().centre_name);
      // console.log(docSnapshot.data(), "shiit");
    });
    // console.log(req_ticket);
    // console.log(my_centres);
    // console.log(myCntr)
    // const productsSnapshot = await firebase.firestore()
    // 	.collection('products')
    // 	.where('uid', '==', userId)
    // 	.get();
    // let products = [];
    // let wishlist = [];
    // if (!productsSnapshot.empty) {
    // 	productsSnapshot.forEach(product => {
    // 		let productData = product.data();
    // 		productData.id = product.id;
    // 		products.push(productData);
    // 	});
    // }
    // if (userSnapshot.data().wishlist.length > 0) {
    // 	for (let i = 0; i < userSnapshot.data().wishlist.length > 0; i++) {
    // 		let item = await firebase.firestore()
    // 			.collection('products')
    // 			.doc(userSnapshot.data().wishlist[i])
    // 			.get();
    // 		if (item.data()) {
    // 			let itemSnapshot;
    // 			itemSnapshot = item.data();
    // 			itemSnapshot.productId = item.id;
    // 			wishlist.push(itemSnapshot);
    // 		}
    // 	}
    // }

    // below is the code to generate a qr code

    // qr_code = [];
    // req_ticket.forEach(ticket => {
    //   console.log(ticket.qrcode);
    // })
    //    QRCode.toDataURL(req_ticket[i].id, function(err, url) {
    //     //'url' stores the url of the generated qr code
    //     qr_code.push(url, "hello");
    //   })
    //   // console.log(i);
    //   // console.log(req_ticket[i].id);

    // }
    // console.log(qr_code);



    res.render('users/profile.ejs', {
      pageTitle: 'Profile',
      auth: true,
      myCntr,
      req_ticket,
      // authorized: userId === req.uid,
      user: {
        ...userSnapshot.data(),
        id: userId
      },
    });

  } catch (err) {
    console.log(err);
  }
};
