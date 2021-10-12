const functions = require("firebase-functions");
const { dialogflow } = require("actions-on-google");

const app = dialogflow();

exports.FalseMemorySyndrome2 = functions.https.onRequest(app);


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
