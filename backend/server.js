import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import roadmapRoutes from "./routes/roadmap.js"; 
import authRoutes from "./routes/auth.js";
// import RoadmapProgress from "../models/RoadmapProgress.js";
import progressRoutes from "./routes/progress.js";
import userRoutes from "./routes/user.js";


dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// === API routes first ===
app.use("/api/roadmaps", roadmapRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/progress", progressRoutes);
// app.use("/api/roadmap-progress", RoadmapProgress);
app.use("/api/user", userRoutes);

  

// === Serve React static files ===
const clientPath = path.join(process.cwd(), "client/dist");
app.use(express.static(clientPath));

// === Catch-all for React SPA ===
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(clientPath, "index.html"));
}); 

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));



  