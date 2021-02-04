const firebase = require('../firebase');

module.exports = async (ticketId) => {
  const  ticket= await firebase.firestore()
    .collection('ticket').doc(ticketId)
    .get();
    console.log(ticket.data());
  let dept=await firebase.firestore()
  .collection('departments').doc(ticket.data().department)
  .update({
    currentToken:ticket.data().token,
  })
}
