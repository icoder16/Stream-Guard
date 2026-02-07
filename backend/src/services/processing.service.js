const Video = require("../models/Video");
const { getIO } = require("./socket.service");

// Fake processing (MVP)
exports.processVideo = async (videoId) => {
  let progress = 0;

  const io = getIO();

  const interval = setInterval(async () => {
    progress += 10;

    if (progress >= 100) {
      clearInterval(interval);

      // Random classification
      const status = Math.random() > 0.7 ? "flagged" : "safe";

      await Video.findByIdAndUpdate(videoId, {
        progress: 100,
        status
      });

      // Final emit
      io.emit("video-done", {
        videoId,
        status
      });

      return;
    }

    // Update DB
    await Video.findByIdAndUpdate(videoId, {
      progress,
      status: "processing"
    });

    // Emit progress
    io.emit("video-progress", {
      videoId,
      progress
    });

  }, 1000); // every 1 sec
};
