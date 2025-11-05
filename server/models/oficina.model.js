/**
 * Modelo de dados para uma Oficina.
 */
function Oficina({ oficinaId, tema, professor, vagas, dataInicio, dataFim, local }) {
    // Validações básicas (podem ser expandidas)
    if (!tema || !professor || !vagas || !dataInicio || !local) {
        throw new Error("Campos obrigatórios (tema, professor, vagas, dataInicio, local) não podem ser vazios.");
    }

    return {
        oficinaId: oficinaId, // O ID do documento
        tema: tema,
        professor: professor, 
        vagas: parseInt(vagas, 10),
        dataInicio: dataInicio, 
        dataFim: dataFim || null,
        local: local,
        alunosInscritos: [], 
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
module.exports = Oficina;