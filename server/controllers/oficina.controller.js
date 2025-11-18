const Oficina = require('../models/oficina.model');
const { db } = require("../config/firestoreConfig");
const oficinasCollection = db.collection("oficinas");
const usersCollection = db.collection("users");
const { verifyVagas, datesOverlap } = require("../helpers/sala.helper");

// Middleware para verificar se é professor
async function isProfessor(req, res, next) {
    try {
        const userDoc = await usersCollection.doc(req.userId).get();
        if (!userDoc.exists || userDoc.data().role !== 'professor') {
            return res.status(403).json({ error: "Acesso negado. Apenas professores podem realizar esta ação." });
        }
        next(); // Usuário é professor, pode continuar
    } catch (err) {
        console.error("🔥 Erro ao verificar permissão de professor:", err);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
}

// GET /api/oficinas - Listar todas as oficinas
async function getAllOficinas(req, res) {
    try {
        const snapshot = await oficinasCollection.orderBy("tema").get();
        if (snapshot.empty) {
            return res.status(200).json([]);
        }
        const oficinas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(oficinas);
    } catch (err) {
        console.error("🔥 Erro ao buscar oficinas:", err);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
}

// POST /api/oficinas - Criar uma nova oficina
async function createOficina(req, res) {
    try {
        const { tema, professor, vagas, dataInicio, dataFim, local } = req.body;
        
        const newOficinaRef = oficinasCollection.doc();
        const oficinaData = Oficina({
            oficinaId: newOficinaRef.id,
            tema,
            professor,
            vagas,
            dataInicio,
            dataFim,
            local
        });
        const result = await verifyVagas(local, vagas);

        if (!result.ok) throw new Error(result.message);

        if (await datesOverlap(local, dataInicio, dataFim)) throw new Error("A sala não está disponível neste horário.")
        
        await newOficinaRef.set(oficinaData);
        res.status(201).json({ message: "Oficina criada com sucesso", oficina: { id: newOficinaRef.id, ...oficinaData } });
    } catch (err) {
        console.error("🔥 Erro ao criar oficina:", err);
        res.status(400).json({ error: err.message || "Erro interno do servidor" });
    }
}

// PUT /api/oficinas/:id - Atualizar uma oficina
async function updateOficina(req, res) {
    try {
        const oficinaId = req.params.id;
        const { tema, professor, vagas, dataInicio, dataFim, local } = req.body;

        const oficinaRef = oficinasCollection.doc(oficinaId);
        const doc = await oficinaRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: "Oficina não encontrada" });
        }

        const updateData = {
            tema,
            professor,
            vagas: parseInt(vagas, 10),
            dataInicio,
            dataFim: dataFim || doc.data().dataFim,
            local,
            updatedAt: new Date()
        };

        await oficinaRef.update(updateData);
        const updatedDoc = await oficinaRef.get();

        res.status(200).json({ message: "Oficina atualizada com sucesso", oficina: { id: updatedDoc.id, ...updatedDoc.data() } });
    } catch (err) {
        console.error("🔥 Erro ao atualizar oficina:", err);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
}

// DELETE /api/oficinas/:id - Excluir uma oficina
async function deleteOficina(req, res) {
    try {
        const oficinaId = req.params.id;
        const oficinaRef = oficinasCollection.doc(oficinaId);
        const doc = await oficinaRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: "Oficina não encontrada" });
        }

        await oficinaRef.delete();
        res.status(200).json({ message: "Oficina excluída com sucesso" });
    } catch (err) {
        console.error("🔥 Erro ao excluir oficina:", err);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
}

// POST /api/oficinas/:id/inscrever
async function inscreverAluno(req, res) {
    try {
        const oficinaId = req.params.id;
        const alunoId = req.userId;

        const oficinaRef = oficinasCollection.doc(oficinaId);
        const oficinaDoc = await oficinaRef.get();

        if (!oficinaDoc.exists) {
            return res.status(404).json({error: "Oficina não encontrada"});
        }

        const oficinaData = oficinaDoc.data();

        if (oficinaData.alunosInscritos && oficinaData.alunosInscritos.includes(alunoId)) {
            return res.status(400).json({error: "Você já está inscrito nesta oficina"});
        }

        const inscritosAtuais = oficinaData.alunosInscritos?.length || 0;
        if (inscritosAtuais >= oficinaData.vagas) {
            return res.status(400).json({error: "Oficina sem vagas disponíveis"});
        }

        const alunosAtualizados = [...(oficinaData.alunosInscritos || []), alunoId];

        await oficinaRef.update({
            alunosInscritos: alunosAtualizados,
            updatedAt: new Date()
        });

        res.status(200).json({
            message: "Inscrição realizada com sucesso",
            vagasRestantes: oficinaData.vagas - alunosAtualizados.length
        })

    } catch (error) {
        console.error("Erro ao fazer a inscrição: ", error);
        res.status(500).json({error: "Erro interno do servidor"});
    }
}

// DELETE /api/oficinas/:id/inscrever
async function cancelarInscricao(req, res) {
    try {
        const oficinaId = req.params.id;
        const alunoId = req.userId;

        const oficinaRef = oficinasCollection.doc(oficinaId);
        const oficinaDoc = await oficinaRef.get();

        if (!oficinaDoc.exists) {
            return res.status(404).json({error: "Oficina não encontrada"});
        }

        const oficinaData = oficinaDoc.data();

        if (!oficinaData.alunosInscritos || !oficinaData.alunosInscritos.includes(alunoId)) {
            return res.status(400).json({error: "Você não está inscrito nesta oficina"});
        }

        const alunosAtualizados = oficinaData.alunosInscritos.filter(id => id !== alunoId);

        await oficinaRef.update({
            alunosInscritos: alunosAtualizados,
            updatedAt: new Date()
        });

        res.status(200).json({
            message: "Inscrição cancelada com sucesso",
            vagasRestantes: oficinaData.vagas - alunosAtualizados.length
        })

    } catch (error) {
        console.error("Erro ao cancelar inscrição: ", error);
        res.status(500).json({error: "Erro interno do servidor"});
    }
}

// GET /api/oficinas/:id/inscritos - Lista alunos inscritos em uma oficina (apenas professores)
async function getAlunosInscritos(req, res) {
    try {
        const oficinaId = req.params.id;

        const oficinaRef = oficinasCollection.doc(oficinaId);
        const oficinaDoc = await oficinaRef.get();

        if (!oficinaDoc.exists) {
            return res.status(404).json({error: "Oficina não encontrada"});
        }

        const oficinaData = oficinaDoc.data();
        const alunosIds = oficinaData.alunosInscritos || [];

        if (alunosIds.length === 0) {
            return res.status(200).json({
                oficina: oficinaData.tema,
                totalInscritos: 0,
                vagas: oficinaData.vagas,
                vagasRestantes: oficinaData.vagas,
                alunos: []
            });

        }

        const alunosPromises = alunosIds.map(alunoId => usersCollection.doc(alunoId).get());
        const alunosDocs = await Promise.all(alunosPromises);

        const alunos = alunosDocs
            .filter(doc => doc.exists)
            .map(doc => ({
                id: doc.id,
                nome: doc.data().nome,
                email: doc.data().email
            }));

        res.status(200).json({
            oficina: oficinaData.tema,
            totalInscritos: alunos.length,
            vagas: oficinaData.vagas,
            vagasRestantes: oficinaData.vagas - alunos.length,
            alunos
        })

    } catch (error) {
        console.error("Erro ao buscar alunos inscritos", error);
        res.status(500).json({error: "Erro interno do servidor"});
    }
}



module.exports = {
    isProfessor,
    getAllOficinas,
    createOficina,
    updateOficina,
    deleteOficina,
    inscreverAluno,
    cancelarInscricao,
    getAlunosInscritos
};