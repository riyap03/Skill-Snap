import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import roadmapRoutes from "./routes/roadmap.js";
import authRoutes from "./routes/auth.js";
import coachRoutes from "./routes/coach.js";
import projectRoutes from "./routes/project.routes.js";
import progressRoutes from "./routes/progress.js";
import assessmentRoutes from "./routes/assessment.js";
import analyticsRoutes from "./routes/analytics.js";
import userRoutes from "./routes/user.js";
import portfolioRoutes from "./routes/portfolio.routes.js";

dotenv.config();

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (allowedOrigins.length === 0 && process.env.NODE_ENV !== "development") {
  console.warn("Warning: CLIENT_URL not set - CORS will allow all origins in production");
}

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.length === 0) {
        console.warn(`No CLIENT_URL configured - allowing origin: ${origin}`);
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/roadmaps", roadmapRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/coach", coachRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/assessment", assessmentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/user", userRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/projects", projectRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));
