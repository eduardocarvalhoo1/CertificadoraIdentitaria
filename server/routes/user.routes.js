const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// POST /api/auth/register
router.post("/register", userController.createUser);

// POST /api/auth/login
router.post("/login", userController.login);

// GET /api/auth/profile/:id - Busca o perfil do usuário
router.get("/profile/:id", authMiddleware.verifyToken, userController.getUserById);

// PUT /api/auth/profile/:id - Atualiza o perfil do usuário
router.put("/profile/:id", authMiddleware.verifyToken, userController.updateUser);

// PUT /api/auth/password/:id - Atualiza a senha do usuário
router.put("/password/:id", authMiddleware.verifyToken, userController.updatePassword);


router.post("/test", authMiddleware.verifyToken, (req, res) => {
    try {
        res.status(200).json({ message: "deu baum" });
    } catch (err) {
        console.error("🔥 Full error:", err); // full object
        console.error("🔥 Error keys:", Object.keys(err)); // see what properties exist
        res.status(400).json({
            error: err.message,
            code: err.code || null,
            stack: err.stack || null,
            details: err.errorInfo || err.info || null
        });
  }
});

module.exports = router;
