const multer = require("multer");
const path = require("path");
const os = require("os");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Use system temp folder (cross-platform)
    cb(null, os.tmpdir());
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Max 50MB
const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024
  },
});

module.exports = upload;
