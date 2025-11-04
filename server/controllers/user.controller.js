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

    
    const snapshot = await usersCollection.where("registro", "==", registro).get();
    if (!snapshot.empty) {
      return res.status(400).json({ error: "Registro já cadastrado" })
    }

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
    
    const token = jwt.sign({ userId: userDoc.userId }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    })
    res.status(201).json({ 
      message: "User created",
      token,
      user: {
        id: userDoc.userId,
        email: userDoc.email,
        name: userDoc.nome,
        role: userDoc.role,
        register: userDoc.registro
      }
     });
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
      return res.status(404).json({ error: "Usuário não encontrado"})
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
      user: {
        id: userDoc.id,
        email: userData.email,
        name: userData.nome,
        role: userData.role,
        register: userData.registro
      },
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

async function getUserById(req, res) {
    try {
      const userId = req.params.id;
  
      if (req.userId !== userId) {
        return res.status(403).json({ error: 'Acesso negado: Você só pode acessar seu próprio perfil.' });
      }
  
      const userDoc = await usersCollection.doc(userId).get();
      if (!userDoc.exists) {
        return res.status(404).json({ error: "Usuário não encontrado" });
      }
  
      const userData = userDoc.data();
      delete userData.senha; 
  
      res.status(200).json(userData);
    } catch (err) {
      console.error("🔥 Erro ao buscar usuário:", err);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
}
  
async function updateUser(req, res) {
    try {
        const userId = req.params.id;
        const { nome, email, especialidade, curso } = req.body;

        if (req.userId !== userId) {
            return res.status(403).json({ error: 'Acesso negado: Você só pode atualizar seu próprio perfil.' });
        }

        const userRef = usersCollection.doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const updateData = {
            nome,
            email,
            especialidade: especialidade || '',
            curso: curso || '',
            updatedAt: new Date()
        };

        await userRef.update(updateData);

        if (email !== userDoc.data().email) {
            await admin.auth().updateUser(userId, { email });
        }
        
        if (nome !== userDoc.data().nome) {
            await admin.auth().updateUser(userId, { displayName: nome });
        }

        const updatedUserDoc = await userRef.get();
        const updatedUserData = updatedUserDoc.data();
        delete updatedUserData.senha;

        res.status(200).json({ message: "Perfil atualizado com sucesso", user: updatedUserData });
    } catch (err) {
        console.error("🔥 Erro ao atualizar usuário:", err);
        res.status(500).json({ error: "Erro interno do servidor", details: err.message });
    }
}

async function updatePassword(req, res) {
    try {
        const userId = req.params.id;
        const { atual, nova } = req.body;

        if (req.userId !== userId) {
            return res.status(403).json({ error: 'Acesso negado: Você só pode atualizar sua própria senha.' });
        }

        const userDoc = await usersCollection.doc(userId).get();
        if (!userDoc.exists) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const userData = userDoc.data();
        
        const isMatch = await bcrypt.compare(atual, userData.senha);
        if (!isMatch) {
            return res.status(401).json({ error: 'Senha atual inválida' });
        }

        const saltRounds = 10;
        const newPasswordHash = await bcrypt.hash(nova, saltRounds);

        await usersCollection.doc(userId).update({ senha: newPasswordHash, updatedAt: new Date() });
        await admin.auth().updateUser(userId, { password: nova });

        res.status(200).json({ message: 'Senha atualizada com sucesso' });
    } catch (err) {
        console.error("🔥 Erro ao atualizar senha:", err);
        res.status(500).json({ error: "Erro interno do servidor", details: err.message });
    }
}

module.exports = { createUser, login, getUserById, updateUser, updatePassword };
