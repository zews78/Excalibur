const firebase = require('../firebase');

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

		// 	const reqSnapshot = await firebase.firestore()
		// 		.collection('requirements')
		// 		.where('uid', '==', userId)
		// 		.get();
		// 	let req_prod = [];
		// 	if (!reqSnapshot.empty) {
		// 		reqSnapshot.forEach(product => {
		// 			let productData = product.data();
		// 			productData.id = product.id;
		// 			req_prod.push(productData);
		// 		});
		// 	}
			// console.log(req_prod);

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

			res.render('users/profile.ejs', {
				pageTitle: 'Profile',
				auth: true,
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