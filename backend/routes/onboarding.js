import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import User from "../models/User.js";

const router = express.Router();

const clampStudyHours = (hours) => {
  const parsed = Number(hours);
  if (!Number.isFinite(parsed)) return 10;
  return Math.min(40, Math.max(1, Math.round(parsed)));
};

router.get("/status", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("learningProfile").lean();
    res.json({
      onboardingCompleted: !!user?.learningProfile?.onboardingCompleted,
      learningProfile: user?.learningProfile || {},
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load onboarding status" });
  }
});

router.post("/save", authMiddleware, async (req, res) => {
  try {
    const {
      currentRole = "",
      targetRole = "",
      knownSkills = [],
      experienceLevel = "beginner",
      weeklyStudyHours = 10,
      learningStyle = "",
    } = req.body;

    const cleanKnownSkills = Array.isArray(knownSkills)
      ? [...new Set(knownSkills.map((skill) => String(skill).trim()).filter(Boolean))]
      : [];

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.learningProfile = {
      ...(user.learningProfile?.toObject?.() || user.learningProfile || {}),
      level: experienceLevel || user.learningProfile?.level || "beginner",
      currentRole: String(currentRole).trim(),
      targetRole: String(targetRole).trim(),
      knownSkills: cleanKnownSkills,
      weeklyStudyHours: clampStudyHours(weeklyStudyHours),
      learningStyle: String(learningStyle).trim(),
      onboardingCompleted: true,
    };

    user.completedSkills = [...new Set([...(user.completedSkills || []), ...cleanKnownSkills])];
    await user.save();

    res.json({ success: true, learningProfile: user.learningProfile });
  } catch (err) {
    res.status(500).json({ message: "Failed to save onboarding" });
  }
});

export default router;
