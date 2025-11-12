const express = require("express");
const router = express.Router();
const oficinaController = require("../controllers/oficina.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Aplica o middleware de verificação de token a todas as rotas
router.use(authMiddleware.verifyToken);

// GET /api/oficinas - Listar todas (qualquer usuário logado)
router.get("/", oficinaController.getAllOficinas);

// POST /api/oficinas - Criar nova (só professor)
router.post("/", oficinaController.isProfessor, oficinaController.createOficina);

// PUT /api/oficinas/:id - Atualizar (só professor)
router.put("/:id", oficinaController.isProfessor, oficinaController.updateOficina);

// DELETE /api/oficinas/:id - Excluir (só professor)
router.delete("/:id", oficinaController.isProfessor, oficinaController.deleteOficina);

// POST /api/oficinas/:id/inscrever
router.post('/:id/inscrever', oficinaController.inscreverAluno);

// DELETE /api/oficinas/:id/inscrever
router.delete('/:id/inscrever', oficinaController.cancelarInscricao);

// GET /api/oficinas/:id/inscritos - Lista alunos inscritos em uma oficina (só professores)
router.get('/:id/inscritos', oficinaController.isProfessor, oficinaController.getAlunosInscritos);

module.exports = router;