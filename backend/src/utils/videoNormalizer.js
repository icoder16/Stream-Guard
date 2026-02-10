const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
const path = require("path");
const fs = require("fs");

ffmpeg.setFfmpegPath(ffmpegPath);

exports.normalizeVideo = (inputPath) => {
  return new Promise((resolve, reject) => {
    const outputPath =
      inputPath.replace(path.extname(inputPath), "") + "_normalized.mp4";

    ffmpeg(inputPath)
      .outputOptions([
        "-c:v libx264",
        "-profile:v main",
        "-level 4.0",
        "-pix_fmt yuv420p",
        "-movflags +faststart",
        "-c:a aac",
        "-ar 48000"
      ])
      .on("end", () => resolve(outputPath))
      .on("error", (err) => reject(err))
      .save(outputPath);
  });
};
