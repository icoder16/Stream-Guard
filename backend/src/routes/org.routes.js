const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/auth.middleware");
const { checkRole } = require("../middlewares/role.middleware");

const orgController = require("../controllers/org.controller");

// Get members (Admin only)
router.get(
  "/members",
  protect,
  orgController.getMembers
);

// Get invite code
router.get(
  "/invite-code",
  protect,
  checkRole(["admin"]),
  orgController.getInviteCode
);

module.exports = router;
