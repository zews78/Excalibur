const firebase = require('../firebase');
// const isAuth = require('../utils/isAuth');
// const keywordGenerator = require('../utils/keywordGenerator');


exports.getHome = async(req, res) => {
	// const auth = (await isAuth(req))[0];
	try {
		// const auth = (await isAuth(req))[0];

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
		console.log(Cntr);
		res.render('main/home.ejs', {
			// auth,
			pageTitle: 'Home',
			Cntr
		});
	} catch (err) {
		console.log(err);
	}
};

exports.getHelp = async(req, res) => {
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
		console.log(Cntr);
		res.render('main/home.ejs', {
			pageTitle: 'Home',
			Cntr
		});
	} catch (err) {
		console.log(err);
	}
};