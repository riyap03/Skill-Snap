import express from "express";
import Progress from "../models/Progress.js";
import authMiddleware from "../middleware/auth.middleware.js";
import User from "../models/User.js";


const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { topic, score, totalQuestions, timeTaken } = req.body;

    const progress = new Progress({
      userId: req.user.id,
      topic,
      score,
      totalQuestions,
      timeTaken,
    });

    await progress.save();

    // ⭐ THIS IS THE IMPORTANT LINE
    await User.findByIdAndUpdate(req.user.id, {
      hasTakenTest: true,
    });

    res.json({ message: "Progress saved" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/check", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    const progress = await Progress.findOne({ userId });
    // if user has at least one progress entry, they have taken a test
    const hasTakenTest = !!progress;

    res.json({ hasTakenTest });
  } catch (err) {
    console.error("Failed to check test status", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
