const express = require("express");
const router = express.Router();
const oficinaController = require("../controllers/oficina.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/", authMiddleware.verifyToken, oficinaController.createOficina);


module.exports = router;