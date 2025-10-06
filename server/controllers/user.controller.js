const User = require('../models/user.model');
const { db, admin } = require("../config/firestoreConfig");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { use } = require('react');
const secretKey = process.env.JWT_SECRET;
const usersCollection = db.collection("users");


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

async function login(req, res) {
  try {
    const { email, senha } = req.body;
    // get user by email
    const snapshot = await usersCollection.where("email", "==", email).get();

    if (snapshot.empty) {
      return res.json(404).json({ error: "Usuário não encontrado"})
    }

    // only one user should match
    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    // check password
    const isMatch = await bcrypt.compare(senha, userData.senha);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: userDoc.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    })

    res.status(200).json({
      token,
      id: userDoc.id,
      email: userData.email,
      name: userData.name,
    });

  } catch (err) {
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

module.exports = { createUser, login };
