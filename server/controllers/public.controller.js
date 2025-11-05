const { db } = require("../config/firestoreConfig");
const oficinasCollection = db.collection("oficinas");
const usersCollection = db.collection("users");

/**
 * Busca estatísticas públicas para o dashboard.
 * Não requer autenticação.
 */
async function getDashboardStats(req, res) {
    try {
        // 1. Contar Oficinas
        const oficinasSnapshot = await oficinasCollection.count().get();
        const totalOficinas = oficinasSnapshot.data().count;

        // 2. Contar Alunos
        const alunosSnapshot = await usersCollection.where("role", "==", "aluno").count().get();
        const totalAlunos = alunosSnapshot.data().count;

        // 3. Contar Professores e Tutores
        
        // Vamos buscar as duas contagens e somar.
        const profSnapshot = await usersCollection.where("role", "==", "professor").count().get();
        const tutorSnapshot = await usersCollection.where("role", "==", "tutor").count().get();
        const totalProfessores = profSnapshot.data().count + tutorSnapshot.data().count;

        res.status(200).json({
            totalOficinas: totalOficinas,
            totalAlunos: totalAlunos,
            totalProfessores: totalProfessores,
        });

    } catch (err) {
        console.error("🔥 Erro ao buscar estatísticas públicas:", err);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
}

module.exports = {
    getDashboardStats,
};