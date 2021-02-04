## Setup
To run this project, install it locally using npm:

```
$ cd functions
$ npm install

$ npm run dev
```



let sessions = center.data().sessions;
let session = req.body.session;

if (!sessions.includes(session)) {
  return new Error("This session is not available");
}




let initialTimes = {
  openingTime: ,
  Morning: req.body.date + "T" + center.data().openingTime,
  Afternoon: req.body.date + "T" + "12:00",
  Evening: req.body.date + "T" + "14:00",
}

let closingTimes = {
  closingTime: ,
  Morning: req.body.date + "T" + "12:00",
  Afternoon: req.body.date + "T" + "14:00",
  Evening: req.body.date + "T" + center.data().closingTime,
}

let absoluteClosingTimes = {
  closingTime: ,
  Morning: 12,
  Afternoon: 14,
  Evening: parseInt(center.data().closingTime.slice(0, 2)) + parseInt(center.data().closingTime.slice(3)) / 60,
}



//Incase that bookedSlots doestnt exist

if (!dData.bookedSlots) {

  dData.bookedSlots = {};

  sessions.forEach((item, i, array) => {

    dData.bookedSlots[item] = [];

    if (array[0] === session && item === session) {

      date = initialTimes.openingTime;
      slot = initialTimes.openingTime.slice(11);
      dData.bookedSlots[item].push(date);
      token = item + ": 1";

    } else if (item === session) {

      date = initialTimes[item];
      slot = initialTimes[item].slice(11);
      dData.bookedSlots[item].push(date);
      token = item + ": 1";
    }

  });

} else { //if bookedSlots exists then
  console.log(dData.bookedSlots);

  sessions.forEach((item, i, array) => {

    if (array[0] === session && item === session) {

      let index = dData.bookedSlots[item].length - 1;
      console.log("index is", index);
      let time = dData.bookedSlots[item][index];
      console.log("time is", time);

      if (!time[index]) { //if it doest even exists

        date = initialTimes.openingTime;
        slot = initialTimes.openingTime.slice(11);
        dData.bookedSlots[item].push(date);
        dData.bookedSlots[item].sort();
        token = item + ": 1";

      } else {

        let bookinitial = dData.bookedSlots[item][0].slice(0, 10);
        let checkInitial = bookinitial.localeCompare(req.body.date);
        let book = time.slice(0, 10); //checking the date
        const check = book.localeCompare(req.body.date);
        if (check === -1 || checkInitial === 1) {
          date = initialTimes.openingTime;
          slot = initialTimes.openingTime.slice(11);
          dData.bookedSlots[item].push(date);
          dData.bookedSlots[item].sort();
          token = item + ": 1";


        } else {
          console.log("check is",check);

          if (check === 1) {

            for (var i = 0; i < dData.bookedSlots[item].length; i++) {
              let bookedDate = dData.bookedSlots[item][i].slice(0, 10);
              const order = bookedDate.localeCompare(req.body.date);
              console.log("order is", order);
              if (order === 1) {
                time = dData.bookedSlots[item][i - 1];
                token = item + ": " + i - 1;
                break;
              }
            }
          }

          console.log("here time is", time);
          let hours = parseInt(time.slice(11, 13));
          let minutes = parseInt(time.slice(14));
          minutes += addedTime;
          console.log(hours);
          console.log(minutes);
          let absoluteTime = hours + minutes / 60;
          if (minutes > 60) {
            hours += 1;
            minutes = minutes % 60;
          }
          if (hours < 10) {
            hours = "0" + hours;
          }
          if (minutes < 10) {
            minutes = "0" + minutes;
          }

          if (absoluteTime < absoluteClosingTimes.closingTime) {
            date = req.body.date + "T" + hours + ":" + minutes;
            slot = hours + ":" + minutes;
            dData.bookedSlots[item].push(date);
            dData.bookedSlots[item].sort();

          } else {
            throw new Error("This session is not available")
          }
        }
      }
    } else if (item === session) {

      let index = dData.bookedSlots[item].length - 1;
      console.log("index is", index);
      let time = dData.bookedSlots[item][index];
      console.log("time is", time);

      if (!time[index]) { //if it doesnt even exists

        date = initialTimes[item];
        slot = initialTimes[item].slice(11);
        dData.bookedSlots[item].push(date);
        dData.bookedSlots[item].sort();
        token = item + ": 1";


      } else {

        let bookinitial = dData.bookedSlots[item][0].slice(0, 10);
        let checkInitial = bookinitial.localeCompare(req.body.date);
        let book = time.slice(0, 10); //checking the date
        const check = book.localeCompare(req.body.date);
        if (check === -1 || checkInitial === 1) {
          date = initialTimes.openingTime;
          slot = initialTimes.openingTime.slice(11);
          dData.bookedSlots[item].push(date);
          dData.bookedSlots[item].sort();
          token = item + ": 1";
          console.log("check:",check,"checkInitial",checkInitial);


        } else {
          console.log("check is",check);

          if (check === 1) {

            for (var i = 0; i < dData.bookedSlots[item].length; i++) {
              let bookedDate = dData.bookedSlots[item][i].slice(0, 10);
              const order = bookedDate.localeCompare(req.body.date);
              console.log("order is", order);
              if (order === 1) {
                time = dData.bookedSlots[item][i - 1];
                token = item + ": " + i - 1;
                break;
              }
            }
          }

          let hours = parseInt(time.slice(11, 13));
          let minutes = parseInt(time.slice(14));
          minutes += addedTime;
          let absoluteTime = hours + minutes / 60;
          if (minutes > 60) {
            hours += 1;
            minutes = minutes % 60;
          }
          if (hours < 10) {
            hours = "0" + hours;
          }
          if (minutes < 10) {
            minutes = "0" + minutes;
          }

          if (absoluteTime < absoluteClosingTimes[item]) {

            date = req.body.date + "T" + hours + ":" + minutes;
            slot = hours + ":" + minutes;
            dData.bookedSlots[item].push(date);
            dData.bookedSlots[item].sort();

          } else {
            throw new Error("This session is not available")
          }
        }
      }
    }
  })
}
const newDept = await firebase.firestore()
  .collection('departments')
  .doc(req.body.Department).set(dData); //overwriting the department document

let tData = {
  userId: req.body.userId,
  // centre_name: req.body.centre_name,
  centre_uid: req.body.centreId,
  department: req.body.Department,
  date,
  slot,
  token
};

let ticket = await firebase.firestore()
  .collection('ticket')
  .add(tData);
console.log(req.body);
res.redirect('/booked/' + ticket.id);
