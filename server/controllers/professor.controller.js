const { db } = require("../config/firestoreConfig");
const usersCollection = db.collection("users");

// GET /api/professors - Listar todos os professors
async function getAllProfessors(req, res) {
    try {
        const snapshot = await usersCollection.where("role", "==", "professor").orderBy("nome").get();
        if (snapshot.empty) {
            return res.status(200).json([]);
        }
        const professors = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(professors);
    } catch (err) {
        console.error("🔥 Erro ao buscar professors:", err);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
}


module.exports = {
    getAllProfessors,
};

