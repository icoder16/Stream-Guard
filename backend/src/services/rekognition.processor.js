const Video = require("../models/Video");
const { getIO } = require("./socket.service");

const {
  startModerationJob,
  getModerationResults
} = require("./rekognition.service");

// Poll Rekognition until done
exports.processWithRekognition = async (video) => {
  const io = getIO();

  try {
    // Start job
    const jobId = await startModerationJob(
      process.env.AWS_BUCKET,
      video.s3Key
    );

    await Video.findByIdAndUpdate(video._id, {
      rekognitionJobId: jobId,
      status: "processing",
      progress: 10
    });

    if (io) {
      io.emit("video-progress", {
        videoId: video._id,
        progress: 10
      });
    }

    // Poll status
    let finished = false;
    let nextToken = null;
    let flagged = false;

    while (!finished) {
      await new Promise((r) => setTimeout(r, 5000)); // wait 5s

      const res = await getModerationResults(jobId, nextToken);

      // Job still running
      if (res.JobStatus === "IN_PROGRESS") {
        continue;
      }

      // Failed
      if (res.JobStatus === "FAILED") {
          console.error("Rekognition FAILED Reason:", res.StatusMessage);
          throw new Error(res.StatusMessage || "Rekognition job failed");
      }

      // Analyze labels
      if (res.ModerationLabels) {
        for (let item of res.ModerationLabels) {

          console.log("Detected:", {
            name: item.ModerationLabel.Name,
            parent: item.ModerationLabel.ParentName,
            confidence: item.ModerationLabel.Confidence
          });

          if (item.ModerationLabel.Confidence > 80) {
            flagged = true;
          }
        }
      }

      nextToken = res.NextToken;

      if (!nextToken) {
        finished = true;
      }
    }

    // Final status
    const status = flagged ? "flagged" : "safe";

    await Video.findByIdAndUpdate(video._id, {
      status,
      progress: 100
    });

    if (io) {
      io.emit("video-done", {
        videoId: video._id,
        status
      });
    }

  } catch (err) {
    console.error("Rekognition Error:", err);

    await Video.findByIdAndUpdate(video._id, {
      status: "flagged"
    });
  }
};
