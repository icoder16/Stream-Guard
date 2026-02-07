const mongoose = require("mongoose");

const orgSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    inviteCode: {
      type: String,
      unique: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Organization", orgSchema);
