import express from "express";
import PDFDocument from "pdfkit";

import authMiddleware from "../middleware/auth.middleware.js";
import Roadmap from "../models/Roadmap.js";
import User from "../models/User.js";
import { ROADMAPS } from "../src/data/roadmap.js";
import { PROJECT_BANK } from "../utils/projectBank.js";

const router = express.Router();

const LEVEL_EXTRAS = {
  beginner: [],
  intermediate: ["Build a portfolio project", "Practice API integration"],
  advanced: ["System Design Basics", "Open Source Contribution"],
};

const slugToTitle = (slug) =>
  slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const getBaseRoadmap = (roadmapName) => ROADMAPS[roadmapName] || null;

const getUserProfile = (user) => ({
  level: user?.learningProfile?.level || "beginner",
  accuracyScore: user?.learningProfile?.accuracyScore || 0,
  speedScore: user?.learningProfile?.speedScore || 0,
});

const getSkillState = (roadmap, skillName) => {
  const stored = roadmap?.skills?.get(skillName);

  return {
    completed: !!stored?.completed,
    completedAt: stored?.completedAt || null,
    history: stored?.history || [],
  };
};

const calculatePace = (roadmap) => {
  if (!roadmap) {
    return {
      pace: "new",
      completedLast7Days: 0,
      completedPrevious7Days: 0,
      weeklyTarget: 3,
      message: "Start with a few focused skills this week.",
    };
  }

  const now = new Date();
  let completedLast7Days = 0;
  let completedPrevious7Days = 0;

  roadmap.skills.forEach((skill) => {
    skill.history.forEach((entry) => {
      if (!entry.status) return;

      const daysAgo = (now - new Date(entry.date)) / (1000 * 60 * 60 * 24);

      if (daysAgo <= 7) completedLast7Days += 1;
      else if (daysAgo <= 14) completedPrevious7Days += 1;
    });
  });

  let pace = "steady";
  let weeklyTarget = 3;
  let message = "You are moving at a steady pace. Keep the streak alive.";

  if (completedLast7Days === 0) {
    pace = "slow";
    weeklyTarget = 2;
    message = "Pick one small skill today and rebuild momentum.";
  } else if (completedLast7Days >= 5 || completedLast7Days > completedPrevious7Days + 2) {
    pace = "fast";
    weeklyTarget = 5;
    message = "Great momentum. Your roadmap can handle a bigger weekly target.";
  } else if (completedPrevious7Days > completedLast7Days + 1) {
    pace = "slowing";
    weeklyTarget = 2;
    message = "Your pace dipped a little. A lighter focus list should help.";
  }

  return {
    pace,
    completedLast7Days,
    completedPrevious7Days,
    weeklyTarget,
    message,
  };
};

const buildAdaptivePlan = (roadmapName, user, roadmap) => {
  const base = getBaseRoadmap(roadmapName);

  if (!base) return null;

  const profile = getUserProfile(user);
  const pace = calculatePace(roadmap);
  const extras = LEVEL_EXTRAS[profile.level] || [];
  const skillNames = [...new Set([...base, ...extras])];
  const skills = {};

  skillNames.forEach((skillName) => {
    skills[skillName] = getSkillState(roadmap, skillName).completed;
  });

  const completed = Object.values(skills).filter(Boolean).length;
  const total = skillNames.length;
  const progress = total ? Math.round((completed / total) * 100) : 0;
  const pendingSkills = skillNames.filter((skillName) => !skills[skillName]);
  const focusSize = pace.pace === "fast" ? 4 : pace.pace === "slow" || pace.pace === "slowing" ? 2 : 3;
  const nextFocus = pendingSkills.slice(0, focusSize);

  return {
    roadmapName,
    title: slugToTitle(roadmapName),
    level: profile.level,
    accuracyScore: Math.round(profile.accuracyScore),
    speedScore: Math.round(profile.speedScore),
    pace,
    weeklyTarget: pace.weeklyTarget,
    nextFocus,
    skills,
    skillOrder: skillNames,
    completed,
    total,
    progress,
  };
};

const buildProjectSuggestions = (completedSkills) => {
  const suggestions = new Set();

  Object.entries(PROJECT_BANK).forEach(([skill, projects]) => {
    if (completedSkills.includes(skill)) {
      projects.forEach((project) => suggestions.add(project));
    }
  });

  if (suggestions.size === 0) {
    Object.values(PROJECT_BANK)
      .flat()
      .slice(0, 3)
      .forEach((project) => suggestions.add(project));
  }

  return [...suggestions].slice(0, 5);
};

router.get("/projects/recommend", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const completed = user?.completedSkills || [];

    res.json({ projects: buildProjectSuggestions(completed) });
  } catch (err) {
    res.status(500).json({ message: "Project recommendation failed" });
  }
});

router.get("/", (req, res) => {
  const roadmaps = Object.keys(ROADMAPS).map((roadmapName) => ({
    roadmapName,
    title: slugToTitle(roadmapName),
    skills: ROADMAPS[roadmapName],
  }));

  res.json({ roadmaps });
});

router.get("/adaptive/:roadmapName", authMiddleware, async (req, res) => {
  try {
    const { roadmapName } = req.params;
    const userId = req.userId;
    const [user, roadmap] = await Promise.all([
      User.findById(userId),
      Roadmap.findOne({ userId, roadmapName }),
    ]);
    const plan = buildAdaptivePlan(roadmapName, user, roadmap);

    if (!plan) {
      return res.status(404).json({ message: "Roadmap not found" });
    }

    res.json(plan);
  } catch (err) {
    res.status(500).json({ message: "Adaptive roadmap failed" });
  }
});

router.get("/:roadmapName", authMiddleware, async (req, res) => {
  try {
    const { roadmapName } = req.params;
    const userId = req.userId;
    const [user, roadmap] = await Promise.all([
      User.findById(userId),
      Roadmap.findOne({ userId, roadmapName }),
    ]);
    const plan = buildAdaptivePlan(roadmapName, user, roadmap);

    if (!plan) {
      return res.status(404).json({ message: "Roadmap not found" });
    }

    res.json(plan);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch roadmap" });
  }
});

router.patch("/:roadmapName/skill", authMiddleware, async (req, res) => {
  try {
    const { roadmapName } = req.params;
    const { skillName, status } = req.body;
    const userId = req.userId;

    if (!skillName || typeof status !== "boolean") {
      return res.status(400).json({ message: "skillName and boolean status are required" });
    }

    const user = await User.findById(userId);
    let roadmap = await Roadmap.findOne({ userId, roadmapName });

    if (!roadmap) {
      roadmap = new Roadmap({
        userId,
        roadmapName,
        skills: {},
      });
    }

    const existing = roadmap.skills.get(skillName);

    roadmap.skills.set(skillName, {
      completed: status,
      completedAt: status ? new Date() : null,
      history: [
        ...(existing?.history || []),
        {
          status,
          date: new Date(),
        },
      ],
    });

    await roadmap.save();

    await User.findByIdAndUpdate(userId, {
      [status ? "$addToSet" : "$pull"]: { completedSkills: skillName },
    });

    const plan = buildAdaptivePlan(roadmapName, user, roadmap);

    res.json({ success: true, ...plan });
  } catch (err) {
    res.status(500).json({ message: "Failed to update skill" });
  }
});

router.get("/:roadmapName/stats", authMiddleware, async (req, res) => {
  try {
    const { roadmapName } = req.params;
    const { range = "weekly" } = req.query;
    const userId = req.userId;
    const roadmap = await Roadmap.findOne({ userId, roadmapName });

    if (!roadmap) return res.json({});

    const days = range === "monthly" ? 30 : 7;
    const now = new Date();
    const stats = {};

    roadmap.skills.forEach((skill) => {
      skill.history.forEach((entry) => {
        if (!entry.status) return;

        const diff = (now - new Date(entry.date)) / (1000 * 60 * 60 * 24);

        if (diff <= days) {
          const day = new Date(entry.date).toISOString().split("T")[0];
          stats[day] = (stats[day] || 0) + 1;
        }
      });
    });

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

router.get("/:roadmapName/insights", authMiddleware, async (req, res) => {
  try {
    const { roadmapName } = req.params;
    const userId = req.userId;
    const [user, roadmap] = await Promise.all([
      User.findById(userId),
      Roadmap.findOne({ userId, roadmapName }),
    ]);
    const plan = buildAdaptivePlan(roadmapName, user, roadmap);

    if (!plan) {
      return res.status(404).json({ message: "Roadmap not found" });
    }

    const focusText = plan.nextFocus.length
      ? ` Next focus: ${plan.nextFocus.join(", ")}.`
      : " You have completed every skill in this roadmap.";

    res.json({
      message: `${plan.pace.message} Weekly target: ${plan.weeklyTarget} skills.${focusText}`,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to generate insight" });
  }
});

router.get("/:roadmapName/timeline", authMiddleware, async (req, res) => {
  try {
    const { roadmapName } = req.params;
    const userId = req.userId;
    const roadmap = await Roadmap.findOne({ userId, roadmapName });

    if (!roadmap) return res.json([]);

    const timeline = [];

    roadmap.skills.forEach((skill, name) => {
      skill.history.forEach((entry) => {
        timeline.push({
          skill: name,
          status: entry.status,
          date: entry.date,
        });
      });
    });

    timeline.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(timeline);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch timeline" });
  }
});

router.get("/:roadmapName/export", authMiddleware, async (req, res) => {
  try {
    const { roadmapName } = req.params;
    const userId = req.userId;
    const [user, roadmap] = await Promise.all([
      User.findById(userId),
      Roadmap.findOne({ userId, roadmapName }),
    ]);
    const plan = buildAdaptivePlan(roadmapName, user, roadmap);

    if (!plan) {
      return res.status(404).send("Roadmap not found");
    }

    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${roadmapName}.pdf`);

    doc.pipe(res);

    doc.fontSize(20).text(`Roadmap: ${plan.title}`);
    doc.moveDown();
    doc.fontSize(12).text(`Level: ${plan.level}`);
    doc.text(`Pace: ${plan.pace.pace}`);
    doc.text(`Progress: ${plan.progress}% (${plan.completed}/${plan.total})`);
    doc.text(`Weekly target: ${plan.weeklyTarget} skills`);
    doc.moveDown();

    plan.skillOrder.forEach((skillName) => {
      doc.text(`${skillName}: ${plan.skills[skillName] ? "Completed" : "Pending"}`);
    });

    doc.end();
  } catch (err) {
    res.status(500).send("Failed to export PDF");
  }
});

export default router;
