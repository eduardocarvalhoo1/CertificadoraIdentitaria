const admin = require("firebase-admin");
const serviceAccount = require("./config/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

console.log("Admin keys:", Object.keys(admin)); // debug

try {
  const db = admin.firestore();
  console.log("Firestore conectado!", typeof db.collection);
} catch (err) {
  console.error("Erro ao inicializar firestore:", err);
}