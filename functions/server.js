const functions = require('firebase-functions');
const app = require('./app');

exports.app = functions.https.onRequest(app);

// const app = require('./app');

// const port = process.env.PORT || 5000;
// app.listen(port, () => {
//   console.log(`Server Started on port ${port}`);
// });
