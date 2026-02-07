const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Organization = require("../models/Organisation");

const generateInviteCode = require("../utils/generateInvite");
const generateToken = require("../utils/generateToken");

// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    const { name, email, password, orgType, orgName, inviteCode } = req.body;

    // Check existing user
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    let organization;
    let role = "editor";

    // -------- CREATE ORG --------
    if (orgType === "create") {
      const code = generateInviteCode();

      organization = await Organization.create({
        name: orgName,
        inviteCode: code
      });

      role = "admin";
    }

    // -------- JOIN ORG --------
    if (orgType === "join") {
      organization = await Organization.findOne({ inviteCode });

      if (!organization) {
        return res.status(400).json({ msg: "Invalid invite code" });
      }
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashed,
      role,
      tenantId: organization._id
    });

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name,
        email,
        role,
        tenantId: user.tenantId
      },
      inviteCode: role === "admin" ? organization.inviteCode : null
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId
      }
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
