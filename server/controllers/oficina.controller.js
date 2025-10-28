const { db } = require("../config/firestoreConfig");
const Oficina = require("../models/oficina.model");

async function createOficina(req, res) {
  try {
    const user = req.user;

    if (user.role !== "Professor") {
      return res.status(403).json({ error: "Apenas professores podem criar oficinas." });
    }

    const { tema, descricao, vagas, dataInicio, dataFim, horario } = req.body;

    if (!tema || !descricao || !vagas || !dataInicio || !dataFim || !horario) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    const novaOficina = Oficina({
      professorId: user.userId,
      tema,
      descricao,
      vagas,
      dataInicio,
      dataFim,
      horario,
    });

    const docRef = await db.collection("oficinas").add(novaOficina);
    const oficinaComId = { ...novaOficina, oficinaId: docRef.id };

    await docRef.update({ oficinaId: docRef.id });

    res.status(201).json({
      message: "Oficina criada com sucesso!",
      oficina: oficinaComId,
    });

  } catch (error) {
    console.error("Erro ao criar a oficina:", error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  createOficina,
};
