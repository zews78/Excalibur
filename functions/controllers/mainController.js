// const firebase = require('../firebase');
// const isAuth = require('../utils/isAuth');
// const keywordGenerator = require('../utils/keywordGenerator');


exports.getHome = async(req, res) => {
	// const auth = (await isAuth(req))[0];
	res.render('main/home', {
		pageTitle: 'Home',
		// auth
	});
};