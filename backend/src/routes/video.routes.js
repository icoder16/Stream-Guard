const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/auth.middleware");
const { checkRole } = require("../middlewares/role.middleware");
const upload = require("../middlewares/upload.middleware");

const videoController = require("../controllers/video.controller");

// Upload (Editor+)
router.post(
  "/upload",
  protect,
  checkRole(["admin", "editor"]),
  upload.single("video"),
  videoController.uploadVideo
);

// List videos
router.get(
  "/",
  protect,
  videoController.getVideos
);

// Stream
router.get(
  "/stream/:id",
  protect,
  videoController.streamVideo
);

module.exports = router;
