const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const salaController = require('../controllers/salas.controller');

// Uses authentication middleware in every route
router.use(authMiddleware.verifyToken);

// GET /api/salas   - Lists all rooms
router.get("/", salaController.getAllSalas);

// GET /api/salas/:id - List a specfic room corresponding to a giving id
router.get("/:id", salaController.getSalaById);

// POST /api/salas  - create a room
router.post("/", salaController.createSala);

// PUT /api/salas/:id - Edit a room
router.put("/:id", salaController.updateSala);

// DELETE /api/salas/:id - DELETE a room
router.delete("/:id", salaController.deleteSala);

module.exports = router;