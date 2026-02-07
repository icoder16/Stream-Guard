const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/auth.middleware");
const { checkRole } = require("../middlewares/role.middleware");
const userController = require("../controllers/user.controller");

// Get own profile
router.get("/me", protect, userController.getMe);

// Change user role (Admin only)
router.patch(
  "/:id/role",
  protect,
  checkRole(["admin"]),
  userController.updateRole
);

module.exports = router;
