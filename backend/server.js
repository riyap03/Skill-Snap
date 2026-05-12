import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import roadmapRoutes from "./routes/roadmap.js"; 
import authRoutes from "./routes/auth.js";

import progressRoutes from "./routes/progress.js";
import userRoutes from "./routes/user.js";
import portfolioRoutes from "./routes/portfolio.routes.js";
dotenv.config();

const app = express();

// Middleware
const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
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

// === API routes first ===
app.use("/api/roadmaps", roadmapRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/progress", progressRoutes);

app.use("/api/user", userRoutes);

  app.use("/api/portfolio", portfolioRoutes);

// === Serve React static files ===
// const clientPath = path.join(process.cwd(), "client/dist");
// app.use(express.static(clientPath));

// // === Catch-all for React SPA ===
// app.get(/^(?!\/api).*/, (req, res) => {
//   res.sendFile(path.join(clientPath, "index.html"));
// }); 

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



  
