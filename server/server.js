const app = require('./config/express')(); 
const port = app.get('port'); 
const admin = require("./config/firestoreConfig"); // <- this exports firebase-admin 
const userRouter = require('./routes/user.routes') 
app.use(userRouter); 
app.listen(port, async () => { 
  console.log(`server running on port ${port}`); 
  try { 
    // Try to access Firestore 
    const db = admin.firestore(); // Write a test document 
    await db.collection("connectionTest").doc("ping").set({ 
      timestamp: new Date(), 
      status: "ok" }); // Read it back 
      const doc = await db.collection("connectionTest").doc("ping").get(); 
      if (doc.exists) { 
        console.log("✅ Firestore connection OK:", doc.data()); 
      } else { 
        console.log("⚠️ Could not read test document"); 
      } 
    } catch (err) { 
      console.error("❌ Firestore connection failed:", err); 
    } 
  });