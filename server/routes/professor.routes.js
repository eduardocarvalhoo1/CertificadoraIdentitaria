const express = require("express");
const router = express.Router();
const alunoController = require("../controllers/professor.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Aplica o middleware de verificação de token a todas as rotas de alunos
router.use(authMiddleware.verifyToken);

router.get("/", alunoController.getAllProfessors);

module.exports = router;
