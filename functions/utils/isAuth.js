const firebase = require('../firebase');


module.exports = async (req) => {
  try {
    let sessionCookie = req.cookies['__session'];
    if (sessionCookie) {
      const decodedToken = await firebase.auth()
        .verifySessionCookie(sessionCookie, true);
        // console.log('Decoded token:', decodedToken);
      return [true, decodedToken];
    } else {
      return [false, {}];
    }
  } catch (err) {
    console.log('Error verifying session cookie:', err);
    return [false, {}];
  }
};
