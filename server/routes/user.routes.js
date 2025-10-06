const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddlware = require("../middlewares/auth.middleware");

// POST /api/users
router.post("/register", userController.createUser);

router.post("/login", userController.login);

router.post("/test", authMiddlware.verifyToken), async (req, res) => {
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
};

module.exports = router;