const firebase = require('../firebase');

module.exports = async (centerId, token) => {
  const tickets = await firebase.firestore()
    .collection('centres').doc(centerId)
    .update({
      token: token
    });
}
