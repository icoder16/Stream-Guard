const User = require("../models/User");
const Organization = require("../models/Organisation");

// ================= GET MEMBERS =================
exports.getMembers = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;

    const users = await User.find({ tenantId }).select("-password");

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ================= GET INVITE CODE =================
exports.getInviteCode = async (req, res) => {
  try {
    const org = await Organization.findById(req.user.tenantId);

    if (!org) {
      return res.status(404).json({ msg: "Organization not found" });
    }

    res.json({ inviteCode: org.inviteCode });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
