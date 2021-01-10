const firebase = require('../firebase');
const url = require('url');
const loginPageNumber = require('../utils/loginPageNumber');


exports.getLogin = async (req, res) => {
  // try {
  // res.render('auth/login.ejs', {
  //     pageTitle: 'Login'
  //     // auth: false
  // });
  const page = await loginPageNumber(req);
  if (page === 1) {
    res.render('auth/login.ejs', {
      pageTitle: 'Login',
      auth: false
    });
  } else if (page === 2) {
    const uid = req.query.uid;
    res.render('auth/SignUp.ejs', {
      pageTitle: 'Enter some details',
      auth: true,
      uid
    });
  } else {
    if (global.redirectTo) {
      res.redirect(global.redirectTo);
    } else {
      res.redirect('/');
    }
  }
  // }
  //     } catch (err) {
  //         console.log(err);
};


exports.postLogin = async (req, res) => {
  try {

    if (req.body.additionalUserInfo.isNewUser) {
      // Create a new user
      const userData = {};
      const uid = req.body.user.uid;
      userData.mobile = req.body.user.phoneNumber;
      firebase.firestore()
        .collection('users')
        .doc(uid)
        .set(userData);
    }
    const expiresIn = 1000 * 60 * 60 * 24 * 14;
    const sessionCookie = await firebase
      .auth()
      .createSessionCookie(req.body.user.stsTokenManager.accessToken, {
        expiresIn
      });
    const cookieOptions = {
      maxAge: expiresIn,
      httpOnly: true
      // secure: true
    };
    res.cookie('__session', sessionCookie, cookieOptions);
    req.query.uid = req.body.user.uid;

    res.redirect(url.format({
      pathname: '/login',
      query: req.query
    }));
  } catch (err) {
    console.log('Something went wrong ');
    console.log(err);
    res.status(500)
      .json({
        message: 'Something went wrong!'
      });
  }
};



exports.postLogout = async (req, res) => {
  try {
    res.clearCookie('session');
    await firebase.auth()
      .revokeRefreshTokens(req.uid);
    res.redirect('/');
  } catch (err) {
    res.redirect('/login');
  }
};
