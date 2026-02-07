const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const orgRoutes = require("./routes/org.routes");
const videoRoutes = require("./routes/video.routes");
const errorHandler = require("./middlewares/error.middleware");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/org", orgRoutes);
app.use("/api/videos", videoRoutes);

// Health Check
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use(errorHandler);

module.exports = app;
