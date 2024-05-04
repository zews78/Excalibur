
const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://excellerentum.firebaseio.com',
  storageBucket: "gs://excellerentum.appspot.com"
});

module.exports = admin;