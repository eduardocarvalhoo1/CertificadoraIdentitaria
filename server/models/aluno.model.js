function Aluno({ alunoId, nome, email, oficina }) {
    return {
        alunoId, 
        nome,
        email,
        oficina,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}
module.exports = Aluno;
