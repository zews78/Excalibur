const firebase = require('../firebase');

const updateToken = async (ticketId) => {
  const  ticket= await firebase.firestore()
    .collection('ticket').doc(ticketId)
    .get();
    console.log("Ticket data",ticket.data());
  let dept=await firebase.firestore()
  .collection('departments').doc(ticket.data().department)
  .update({
    currentToken:ticket.data().token,
  })
}

const updateSlots= async (dData,deptId,date)=>{
  //a function that get all the tickets having the same department id and date and sets their token accordingly
  try {
  let ticketsRef = await firebase.firestore()
  .collection('ticket');
  let tickets=await ticketsRef.where('department', '==',deptId)
  .where('date','==',date).get()
//     if (tickets.empty) {
//       console.log('No matching documents.');
//       return;
//     }
 if(tickets.length!==0){
   tickets.forEach(async (doc) => {
      let newToken=dData.bookedSlots[date].findIndex((slot)=>slot===doc.data().slot);
      newToken+=1;

      let ticket=await ticketsRef.doc(doc.id)
      .update({
        token:newToken,
      })
    });
 }
} catch (e) {
  console.log(e);
}
}
module.exports={
  updateToken,
  updateSlots
}
