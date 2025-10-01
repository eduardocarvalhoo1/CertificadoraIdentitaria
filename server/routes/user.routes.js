const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

// POST /api/users
router.post("/", userController.createUser);

module.exports = router;