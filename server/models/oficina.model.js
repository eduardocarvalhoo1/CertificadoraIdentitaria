function Oficina({ oficinaId, professorId, tema, descricao, vagas, dataInicio, dataFim, horario }) {
    return {
        oficinaId,
        professorId,
        tema,
        descricao,
        vagas,
        dataInicio,
        dataFim,
        horario,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}

module.exports = Oficina;
