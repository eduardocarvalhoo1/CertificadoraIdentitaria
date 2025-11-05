const express = require("express");
const router = express.Router();
const publicController = require("../controllers/public.controller");

// Rota pública para estatísticas do Dashboard
// Não usa o authMiddleware
router.get("/stats", publicController.getDashboardStats);

module.exports = router;