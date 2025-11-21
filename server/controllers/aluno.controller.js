const Aluno = require('../models/aluno.model');
const { db } = require("../config/firestoreConfig");
const usersCollection = db.collection("users");

// GET /api/alunos - Listar todos os alunos
async function getAllAlunos(req, res) {
    try {
        const snapshot = await usersCollection.where("role", "==", "aluno").orderBy("nome").get();
        if (snapshot.empty) {
            return res.status(200).json([]);
        }
        const alunos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(alunos);
    } catch (err) {
        console.error("🔥 Erro ao buscar alunos:", err);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
}

// POST /api/alunos - Criar um novo aluno
async function createAluno(req, res) {
    try {
        const userDoc = await usersCollection.doc(req.userId).get();
        if (!userDoc.exists || userDoc.data().role !== 'professor') {
            return res.status(403).json({ error: "Acesso negado. Somente professores podem criar alunos." });
        }

        const { nome, email, oficina } = req.body;
        if (!nome || !email || !oficina) {
            return res.status(400).json({ error: "Nome, email e oficina são obrigatórios." });
        }
        const newAlunoRef = usersCollection.doc();
        const alunoData = Aluno({
            alunoId: newAlunoRef.id,
            nome,
            email,
            oficina
        });

        await newAlunoRef.set(alunoData);
        res.status(201).json({ message: "Aluno criado com sucesso", aluno: { id: newAlunoRef.id, ...alunoData } });
    } catch (err) {
        console.error("🔥 Erro ao criar aluno:", err);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
}

// PUT /api/alunos/:id - Atualizar um aluno
async function updateAluno(req, res) {
    try {
        const userDocCheck = await usersCollection.doc(req.userId).get();
        if (!userDocCheck.exists || userDocCheck.data().role !== 'professor') {
            return res.status(403).json({ error: "Acesso negado. Somente professores podem editar alunos." });
        }

        const alunoId = req.params.id;
        const { nome, email, oficina } = req.body;

        const alunoRef = usersCollection.doc(alunoId);
        const doc = await alunoRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: "Aluno não encontrado" });
        }

        const updateData = {
            nome,
            email,
            oficina,
            updatedAt: new Date()
        };

        await alunoRef.update(updateData);
        const updatedDoc = await alunoRef.get();

        res.status(200).json({ message: "Aluno atualizado com sucesso", aluno: { id: updatedDoc.id, ...updatedDoc.data() } });
    } catch (err) {
        console.error("🔥 Erro ao atualizar aluno:", err);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
}

// DELETE /api/alunos/:id - Excluir um aluno
async function deleteAluno(req, res) {
    try {
        const userDoc = await usersCollection.doc(req.userId).get();
        if (!userDoc.exists || userDoc.data().role !== 'professor') {
            return res.status(403).json({ error: "Acesso negado. Somente professores podem excluir alunos." });
        }

        const alunoId = req.params.id;
        const alunoRef = usersCollection.doc(alunoId);
        const doc = await alunoRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: "Aluno não encontrado" });
        }

        await alunoRef.delete();
        res.status(200).json({ message: "Aluno excluído com sucesso" });
    } catch (err) {
        console.error("🔥 Erro ao excluir aluno:", err);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
}

module.exports = {
    getAllAlunos,
    createAluno,
    updateAluno,
    deleteAluno
};

