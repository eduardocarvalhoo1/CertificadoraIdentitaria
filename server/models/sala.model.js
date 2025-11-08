/** *
* Modelo de dados para um Sala 
**/
function Sala({ salaId, nome, capacidade, bloco }) {
    // Validações 
    if (!nome || !capacidade) {
        throw new Error("Campos obrigatórios (nome, capacidade) não podem ser vazios")
    }

    return {
        salaId: salaId,
        nome: nome,
        capacidade: capacidade,
        bloco: bloco,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}

module.exports = Sala;