const firebase = require('../firebase');
// const firebaseClient = require('firebase/app');
// require('firebase/auth');
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
      res.redirect('/center');
    }
  }
  // }
  //     } catch (err) {
  //         console.log(err);
};


// const firebaseConfig = {
//   apiKey: "AIzaSyCu5caF7aB_gkR8Q-saLrZZ5d8GWGVrQo4",
//   authDomain: "excellerentum.firebaseapp.com",
//   projectId: "excellerentum",
//   storageBucket: "excellerentum.appspot.com",
//   messagingSenderId: "1051021172847",
//   appId: "1:1051021172847:web:2a2dd8e228c5f45703ed9a",
//   measurementId: "G-TZCL141YVN"
// };

// Initialize Firebase
// firebaseClient.initializeApp(firebaseConfig);

// const { getAuth, GoogleAuthProvider, signInWithCredential, signInWithEmailAndPassword } = require('firebase/auth');

exports.postLogin = async (req, res) => {
  try {
    const { email, password, idToken, provider } = req.body;
    // let userCredential;

    // const auth = getAuth();

    // if (provider === 'google') {
    //   // Sign in with Google
    //   const credential = GoogleAuthProvider.credential(idToken);
    //   userCredential = await signInWithCredential(auth, credential);
    // } else {
    //   // Sign in with email and password
    //   userCredential = await signInWithEmailAndPassword(auth, email, password);
    // }

    // if (req.body.additionalUserInfo.isNewUser) {
    //   // Create a new user
    //   const userData = {};
    //   const uid = req.body.user.uid;
    //   userData.mobile = req.body.user.phoneNumber;
    //   firebase.firestore()
    //     .collection('users')
    //     .doc(uid)
    //     .set(userData);
    // }
    // console.log("post login data", req.body);

    const expiresIn = 1000 * 60 * 60 * 24 * 14;
    // const sessionCookie = await firebase.auth().createSessionCookie(user.stsTokenManager.accessToken, { expiresIn });
    const sessionCookie = await firebase.auth().createSessionCookie(idToken, { expiresIn });

    const cookieOptions = {
      maxAge: expiresIn,
      httpOnly: true
      // secure: true
    };
    res.cookie('__session', sessionCookie, cookieOptions);
    // req.query.uid = user.uid;\


    // Decode the session cookie
    const decodedToken = await firebase.auth().verifySessionCookie(sessionCookie, true);
    const uid = decodedToken.uid;

    // Check if user exists in the database
    const userRef = firebase.firestore().collection('users').doc(uid);
    const doc = await userRef.get();

    if (!doc.exists) {
      // User does not exist, push user data into the database
      await userRef.set({
        uid: uid,
        email: decodedToken.email,
        name: decodedToken.name
        // Add other user data as needed
      });
    }

    res.redirect(url.format({
      pathname: '/login',
      query: req.query
    }));
  } catch (err) {
    console.log('Something went wrong ');
    console.log(err);
    res.status(500).json({ message: 'Something went wrong!' });
  }
};



// exports.postLogin = async (req, res) => {
//   try {

//     if (req.body.additionalUserInfo.isNewUser) {
//       // Create a new user
//       const userData = {};
//       const uid = req.body.user.uid;
//       userData.mobile = req.body.user.phoneNumber;
//       firebase.firestore()
//         .collection('users')
//         .doc(uid)
//         .set(userData);
//     }
//     const expiresIn = 1000 * 60 * 60 * 24 * 14;
//     const sessionCookie = await firebase
//       .auth()
//       .createSessionCookie(req.body.user.stsTokenManager.accessToken, {
//         expiresIn
//       });
//     const cookieOptions = {
//       maxAge: expiresIn,
//       httpOnly: true
//       // secure: true
//     };
//     res.cookie('__session', sessionCookie, cookieOptions);
//     req.query.uid = req.body.user.uid;

//     res.redirect(url.format({
//       pathname: '/login',
//       query: req.query
//     }));
//   } catch (err) {
//     console.log('Something went wrong ');
//     console.log(err);
//     res.status(500)
//       .json({
//         message: 'Something went wrong!'
//       });
//   }
// };



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
