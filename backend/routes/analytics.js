import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import User from "../models/User.js";
import Progress from "../models/Progress.js";
import AssessmentResult from "../models/AssessmentResult.js";
import Roadmap from "../models/Roadmap.js";

const router = express.Router();

const computeStreak = (activities) => {
  if (!activities.length) return 0;
  const dates = Array.from(new Set(activities.map((a) => {
    const d = new Date(a.createdAt || a.date);
    return d.toISOString().split("T")[0];
  })));
  dates.sort((a, b) => new Date(b) - new Date(a));

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let expected = today;

  for (let i = 0; i < dates.length; i++) {
    const current = new Date(dates[i]);
    current.setHours(0, 0, 0, 0);
    const diffDays = Math.round((expected - current) / (1000 * 60 * 60 * 24));

    if (diffDays === 0 || (i === 0 && diffDays === 1)) {
      streak += 1;
      expected = new Date(current);
      expected.setDate(expected.getDate() - 1);
    } else if (diffDays === 1 && i > 0) {
      streak += 1;
      expected = new Date(current);
      expected.setDate(expected.getDate() - 1);
    } else if (diffDays > 1) {
      break;
    }
  }

  return streak;
};

router.get("/overview", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    let user, progresses, assessments, roadmaps;
    try {
      [user, progresses, assessments, roadmaps] = await Promise.all([
        User.findById(userId).lean(),
        Progress.find({ userId }).sort({ createdAt: -1 }).lean(),
        AssessmentResult.find({ userId }).sort({ createdAt: -1 }).limit(20).lean(),
        Roadmap.find({ userId }).lean(),
      ]);
    } catch (dbErr) {
      console.error("Analytics overview DB error:", dbErr);
      return res.json({ overview: {} });
    }

    const learningProfile = user?.learningProfile || {};
    const completedSkills = user?.completedSkills || [];

const totalProgressSkills = Array.isArray(roadmaps)
  ? roadmaps.reduce((acc, r) => {
      const skills = r.skills;
      if (!skills) return acc;
      const entries = typeof skills.entries === "function" ? Array.from(skills.entries()) : [];
      entries.forEach(([name, skill]) => {
        if (skill?.status || skill?.completed) acc += 1;
      });
      return acc;
    }, 0)
  : 0;

const totalSkills = Array.isArray(roadmaps)
  ? roadmaps.reduce((acc, r) => {
      const skills = r.skills;
      if (!skills) return acc;
      if (typeof skills.size === "number") {
        return acc + skills.size;
      }
      if (Array.isArray(skills)) {
        return acc + skills.length;
      }
      const keys = Object.keys(skills || {});
      return acc + keys.length;
    }, 0)
  : completedSkills.length || 0;

    const allActivities = [
      ...(Array.isArray(progresses)
        ? progresses.map((p) => ({ createdAt: p.createdAt, type: "progress" }))
        : []),
      ...(Array.isArray(assessments)
        ? assessments.map((a) => ({ createdAt: a.createdAt, type: "assessment" }))
        : []),
    ];

    const streak = computeStreak(allActivities);

    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(now);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    const weeklyMinutes = Array.isArray(progresses)
      ? progresses
          .filter((p) => new Date(p.createdAt) >= weekAgo)
          .reduce((acc, p) => acc + (p.timeTaken || 0), 0)
      : 0;
    const monthlyMinutes = Array.isArray(progresses)
      ? progresses
          .filter((p) => new Date(p.createdAt) >= monthAgo)
          .reduce((acc, p) => acc + (p.timeTaken || 0), 0)
      : 0;

    const overview = {
      streak,
      completedSkills: completedSkills.length + totalProgressSkills,
      totalSkills,
      assessmentCount: Array.isArray(assessments) ? assessments.length : 0,
      weeklyHours: Math.round(weeklyMinutes / 60),
      monthlyHours: Math.round(monthlyMinutes / 60),
      level: learningProfile.level || "beginner",
      accuracyScore: Math.round(learningProfile.accuracyScore || 0),
      speedScore: Math.round(learningProfile.speedScore || 0),
    };

    res.json({ overview });
  } catch (err) {
    console.error("Analytics overview error:", err);
    res.status(500).json({ message: "Failed to load overview" });
  }
});

router.get("/skills", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    let progresses, user, roadmaps;
    try {
      progresses = await Progress.find({ userId }).sort({ createdAt: 1 }).lean();
      user = await User.findById(userId).lean();
      roadmaps = await Roadmap.find({ userId }).lean();
    } catch (dbErr) {
      console.error("Analytics skills DB error:", dbErr);
      return res.json({ skills: [] });
    }

    const byDate = new Map();
    const addDay = (dateStr, count) => {
      if (!dateStr) return;
      const prev = byDate.get(dateStr) || 0;
      byDate.set(dateStr, prev + count);
    };

    (progresses || []).forEach((p) => {
      const day = new Date(p.createdAt).toISOString().split("T")[0];
      addDay(day, 1);
    });

    (roadmaps || []).forEach((r) => {
      if (!r.skills) return;
      const entries = typeof r.skills.entries === "function" ? Array.from(r.skills.entries()) : [];
      entries.forEach(([name, skill]) => {
        const date = skill?.completedAt || skill?.startedAt;
        const day = date ? new Date(date).toISOString().split("T")[0] : null;
        if (day) addDay(day, 1);
      });
    });

    const data = Array.from(byDate.entries())
      .map(([name, completed]) => ({ name, completed }))
      .slice(-20);

    res.json({ skills: data });
  } catch (err) {
    console.error("Analytics skills error:", err);
    res.status(500).json({ message: "Failed to load skills data" });
  }
});

router.get("/roadmap", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    let roadmaps;
    try {
      roadmaps = await Roadmap.find({ userId }).lean();
    } catch (dbErr) {
      console.error("Analytics roadmap DB error:", dbErr);
      return res.json({ roadmaps: [] });
    }

    const data = (roadmaps || []).map((r) => {
      let total = 0;
      let completed = 0;
      const skills = r.skills;
      let latestDate = null;
      if (skills) {
        const entries = typeof skills.entries === "function" ? Array.from(skills.entries()) : [];
        total = entries.length || 0;
        entries.forEach(([name, skill]) => {
          if (skill?.status || skill?.completed) completed += 1;
          const skillDate = skill?.completedAt || skill?.startedAt;
          if (skillDate) {
            const d = new Date(skillDate);
            if (!latestDate || d > latestDate) latestDate = d;
          }
        });
      }
      const progress = total ? Math.round((completed / total) * 100) : 0;
      const dateStr = latestDate
        ? latestDate.toISOString().split("T")[0]
        : r.createdAt
        ? new Date(r.createdAt).toISOString().split("T")[0]
        : null;
      return {
        name: r.roadmapName,
        completed,
        total,
        progress,
        date: dateStr,
      };
    });

    res.json({ roadmaps: data });
  } catch (err) {
    console.error("Analytics roadmap error:", err);
    res.status(500).json({ message: "Failed to load roadmap data" });
  }
});

router.get("/assessments", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    let assessments;
    try {
      assessments = await AssessmentResult.find({ userId })
        .sort({ createdAt: 1 })
        .limit(30)
        .lean();
    } catch (dbErr) {
      console.error("Analytics assessments DB error:", dbErr);
      return res.json({ assessments: [] });
    }

    const data = (assessments || []).map((a) => ({
      date: new Date(a.createdAt).toISOString().split("T")[0],
      accuracy: a.accuracy || 0,
      type: a.type,
    }));

    res.json({ assessments: data });
  } catch (err) {
    console.error("Analytics assessments error:", err);
    res.status(500).json({ message: "Failed to load assessments data" });
  }
});

export default router;
