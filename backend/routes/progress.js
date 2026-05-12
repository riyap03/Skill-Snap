import express from "express";
import Progress from "../models/Progress.js";
import authMiddleware from "../middleware/auth.middleware.js";
import User from "../models/User.js";

const router = express.Router();

/**
 * SAVE PROGRESS (test attempt)
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { topic, score, totalQuestions, timeTaken } = req.body;
    const accuracy = totalQuestions ? (score / totalQuestions) * 100 : 0;
    const speedScore = Math.max(0, 100 - (timeTaken || 0));

    let level = "beginner";
    if (accuracy > 80) level = "advanced";
    else if (accuracy > 50) level = "intermediate";

    const progress = new Progress({
      userId: req.userId,
      topic,
      score,
      totalQuestions,
      timeTaken,
    });

    await progress.save();

    await User.findByIdAndUpdate(req.userId, {
      hasTakenTest: true,
      learningProfile: {
        accuracyScore: accuracy,
        speedScore,
        level,
      },
    });

    res.json({ message: "Progress saved", level, accuracy, speedScore });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * UPDATE LEARNING PROFILE (THIS IS YOUR PERSONALIZATION CORE)
 */
router.post("/submit", authMiddleware, async (req, res) => {
  try {
    const { score, totalQuestions, timeTaken } = req.body;

    const accuracy = (score / totalQuestions) * 100;
    const speedScore = Math.max(0, 100 - timeTaken);

    let level = "beginner";
    if (accuracy > 80) level = "advanced";
    else if (accuracy > 50) level = "intermediate";

    await User.findByIdAndUpdate(req.userId, {
      learningProfile: {
        accuracyScore: accuracy,
        speedScore,
        level,
      },
    });

    res.json({ level, accuracy, speedScore });
  } catch (err) {
    res.status(500).json({ message: "Test submission failed" });
  }
});

/**
 * CHECK IF TEST TAKEN
 */
router.get("/check", authMiddleware, async (req, res) => {
  try {
    const [user, progress] = await Promise.all([
      User.findById(req.userId),
      Progress.findOne({ userId: req.userId }),
    ]);

    res.json({ hasTakenTest: !!user?.hasTakenTest || !!progress });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
