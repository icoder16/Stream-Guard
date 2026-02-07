const User = require("../models/User");

// ================= GET ME =================
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// ================= UPDATE ROLE =================
exports.updateRole = async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.params.id;

    // Validate role
    if (!["admin", "editor", "viewer"].includes(role)) {
      return res.status(400).json({ msg: "Invalid role" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Ensure same tenant
    if (user.tenantId.toString() !== req.user.tenantId) {
      return res.status(403).json({ msg: "Cannot change because different organization" });
    }

    // Prevent admin removing himself
    if (req.user.id === userId) {
      return res
        .status(400)
        .json({ msg: "Admin cannot demote himself" });
    }

    user.role = role;
    await user.save();

    res.json({
      msg: "Role updated",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};
