const Sala = require('../models/sala.model');
const { db } = require('../config/firestoreConfig');
const salasCollection = db.collection('salas');


// GET /api/salas   - Lists all rooms
async function getAllSalas(req, res) {
    try {
        const snapshot = await salasCollection.orderBy('nome').get();
        if (snapshot.empty) {
            return res.status(200).json([]);
        }
        const salas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(salas);
    } catch (err) {
        console.error("Erro ao buscar salas: ", err);
        res.status(500).json({ error: 'Erro interno do servidor'});
    }
}

// GET /api/salas/:id - List a specfic room corresponding to a giving id
async function getSalaById(req, res) {
    try {
        const salaId = req.params.id;
        const salaRef =  salasCollection.doc(salaId);
        const doc = await salaRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: "Sala não encontrada" });
        }

        res.status(200).json({ id: salaId, ...doc.data()})

    } catch (err) {
        console.error("Erro ao criar sala: ", err);
        res.status(500).json({ error: err.message || 'Erro interno do servidor'})
    }
}

// POST /api/salas  - create a room
async function createSala(req, res) {
    try { 
        const { nome, capacidade, bloco } = req.body;

        const snapshot = await salasCollection.where("nome", "==", nome).get();
        if (!snapshot.empty) {
            return res.status(400).json({ error: "Sala já cadastrada" })
        }

        const newSalaRef = salasCollection.doc();
        const salaData = Sala({
            salaId: newSalaRef.id,
            nome, 
            capacidade, 
            bloco
        });

        await newSalaRef.set(salaData);
        res.status(201).json({ message: "Sala criada com sucesso", sala: { id: newSalaRef.id, ...salaData }});


    } catch (err) {
        console.error("Erro ao criar sala: ", err);
        res.status(500).json({ error: err.message || 'Erro interno do servidor'})
    }
}
// PUT /api/salas/:id - Edit a room
async function updateSala(req, res) {
    try{
        salaId = req.params.id;
        const { nome, capacidade, bloco } = req.body;

        const salaRef = salasCollection.doc(salaId);
        const doc = await salaRef.get();

        if(!doc.exists) {
            return res.status(404).json({ error: "Oficina não encontrada"});
        }

        const updatedData = {
            nome,
            capacidade,
            bloco,
            updatedAt: new Date()
        };

        await salaRef.update(updatedData);
        const updatedDoc = await salaRef.get();

        res.status(200).json({message: "Sala atualizada com sucesso", sala: {...updatedDoc.data()}});
    } catch (err)  {
        console.error("Erro ao atualizar sala: ", err);
        res.status(500).json({ error: 'Erro interno do servidor'});
    }
}
// DELETE /api/salas/:id - DELETE a room
async function deleteSala(req, res) {
    try{
        const salaId = req.params.id;
        const salaRef = salasCollection.doc(salaId);
        const doc = await salaRef.get();

        if (!doc.exists) {
            return res.status(404).json({ error: 'Sala não encontrada' });
        }

        await salaRef.delete();
        res.status(200).json({ message: 'Sala excluída com sucesso' });
    } catch (err) {
        console.error("Erro ao excluir sala: ", err);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
}


module.exports = {
    getAllSalas,
    getSalaById,
    createSala,
    updateSala,
    deleteSala
}