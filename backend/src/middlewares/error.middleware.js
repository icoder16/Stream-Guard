module.exports = (err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      msg: "File too large. Max size is 500MB."
    });
  }

  if (err.message === "Only video files allowed") {
    return res.status(400).json({
      msg: err.message
    });
  }

  res.status(500).json({
    msg: "Server error",
    error: err.message
  });
};
