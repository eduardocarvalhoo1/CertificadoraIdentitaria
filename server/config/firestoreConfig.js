var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://gerenciador-de-oficinas-default-rtdb.firebaseio.com"
});

module.exports = admin;
