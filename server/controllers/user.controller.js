const User = require('../models/user.model');
const admin = require("../config/firestoreConfig");
const bcrypt = require("bcrypt");

async function createUser(req, res) {
  try {
    let { nome, senha, email, registro, role } = req.body;
    const saltRounds = 10;

    // hashing password
    senha = await bcrypt.hash(senha, saltRounds);

    // Create Firebase Auth user
    const userRecord = await admin.auth().createUser({
      email,
      displayName: nome,
      password: senha  // required for email/password login
    });

    // Build user object
    const userDoc = User({
      userId: userRecord.uid,
      nome,
      email,
      senha,    
      registro,
      role
    });

    // Save in Firestore
    await admin.firestore().collection("users").doc(userRecord.uid).set(userDoc);

    res.status(201).json({ message: "User created", user: userDoc });
  }  catch (err) {
        console.error("🔥 Full error:", err); // full object
        console.error("🔥 Error keys:", Object.keys(err)); // see what properties exist
        res.status(400).json({
            error: err.message,
            code: err.code || null,
            stack: err.stack || null,
            details: err.errorInfo || err.info || null
        });
    }
}

module.exports = { createUser };
