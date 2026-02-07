const multer = require("multer");

// Store file in memory
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(new Error("Only video files allowed"), false);
  }
};

// Max 50MB
const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024
  },
  fileFilter
});

module.exports = upload;
