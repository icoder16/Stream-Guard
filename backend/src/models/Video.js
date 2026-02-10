const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    s3Key: {
      type: String,
      required: true
    },

    s3Url: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["pending", "processing", "safe", "flagged"],
      default: "pending"
    },

    progress: {
      type: Number,
      default: 0
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization"
    },

    rekognitionJobId: {
      type: String
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Video", videoSchema);
