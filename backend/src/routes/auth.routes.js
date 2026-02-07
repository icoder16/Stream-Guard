const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// Test
router.get("/test", (req, res) => {
  res.json({ msg: "Auth route working" });
});

// Register
router.post("/register", authController.register);

// Login
router.post("/login", authController.login);

module.exports = router;
