const express = require("express");
const router = express.Router();
const alunoController = require("../controllers/aluno.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Aplica o middleware de verificação de token a todas as rotas de alunos
router.use(authMiddleware.verifyToken);

router.get("/", alunoController.getAllAlunos);
router.post("/", alunoController.createAluno);
router.put("/:id", alunoController.updateAluno);
router.delete("/:id", alunoController.deleteAluno);

module.exports = router;
