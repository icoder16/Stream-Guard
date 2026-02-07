const { v4: uuidv4 } = require("uuid");

const Video = require("../models/Video");
const { uploadToS3 } = require("../services/s3.service");
const { processVideo } = require("../services/processing.service");
const { getSignedUrl } = require("../services/stream.service");

// ================= UPLOAD VIDEO =================
exports.uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No file uploaded" });
    }

    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ msg: "Title required" });
    }

    // Generate filename
    const ext = req.file.originalname.split(".").pop();

    const fileName = `videos/${req.user.tenantId}/${uuidv4()}.${ext}`;

    // Upload to S3
    const result = await uploadToS3(req.file, fileName);

    // Save in DB
    const video = await Video.create({
      title,
      s3Key: fileName,
      s3Url: result.Location,
      uploadedBy: req.user.id,
      tenantId: req.user.tenantId,
      status: "processing"
    });

    res.status(201).json({
      msg: "Upload successful",
      video
    });

    processVideo(video._id);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Upload failed due to server error" });
  }
};

// ================= GET VIDEOS =================
exports.getVideos = async (req, res) => {
  try {
    const {
      status,
      fromDate,
      toDate,
      search,
      page = 1,
      limit = 6
    } = req.query;

    let filter = {
      tenantId: req.user.tenantId
    };

    /* ===== Status Filter ===== */
    if (status) {
      filter.status = status;
    }

    /* ===== Date Filter ===== */
    if (fromDate || toDate) {
      filter.createdAt = {};

      if (fromDate) {
        filter.createdAt.$gte = new Date(fromDate);
      }

      if (toDate) {
        filter.createdAt.$lte = new Date(toDate);
      }
    }

    /* ===== Search by Title ===== */
    if (search) {
      filter.title = {
        $regex: search,
        $options: "i" // case-insensitive
      };
    }

    /* ===== Pagination ===== */
    const skip = (page - 1) * limit;

    const total = await Video.countDocuments(filter);

    const videos = await Video.find(filter)
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      videos,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit)
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ================= STREAM VIDEO =================
exports.streamVideo = async (req, res) => {
  try {
    const videoId = req.params.id;

    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({ msg: "Video not found" });
    }

    // Tenant check
    if (video.tenantId.toString() !== req.user.tenantId) {
      return res.status(403).json({ msg: "Access denied because different tenant" });
    }

    // Only allow processed videos
    if (video.status !== "safe" && video.status !== "flagged") {
      return res
        .status(400)
        .json({ msg: "Video still processing" });
    }

    const url = await getSignedUrl(video.s3Key);

    res.json({ url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Streaming error" });
  }
};
