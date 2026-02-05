import express from "express";
import Roadmap from "../models/Roadmap.js";
import authMiddleware from "../middleware/auth.middleware.js";
import PDFDocument from "pdfkit";

const router = express.Router();

/**
 * GET ROADMAP PROGRESS
 * GET /api/roadmaps/:roadmapName
 */
router.get("/:roadmapName", authMiddleware, async (req, res) => {
  try {
    const { roadmapName } = req.params;
    const userId = req.userId;

    const roadmap = await Roadmap.findOne({ userId, roadmapName });
    if (!roadmap) return res.json({ skills: null });

    const skills = {};
    roadmap.skills.forEach((val, key) => {
      skills[key] = val.completed;
    });

    res.json({ skills });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch roadmap" });
  }
});

/**
 * UPDATE SKILL STATUS
 * PATCH /api/roadmaps/:roadmapName/skill
 */
router.patch("/:roadmapName/skill", authMiddleware, async (req, res) => {
  try {
    const { roadmapName } = req.params;
    const { skillName, status } = req.body;
    const userId = req.userId;

    let roadmap = await Roadmap.findOne({ userId, roadmapName });

    if (!roadmap) {
      roadmap = new Roadmap({
        userId,
        roadmapName,
        skills: {},
      });
    }

    const existing = roadmap.skills.get(skillName);

    const updatedSkill = {
      completed: status,
      completedAt: status ? new Date() : null,
      history: [
        ...(existing?.history || []),
        { status, date: new Date() },
      ],
    };

    roadmap.skills.set(skillName, updatedSkill);
    await roadmap.save();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to update skill" });
  }
});

/**
 * WEEKLY / MONTHLY STATS
 * GET /api/roadmaps/:roadmapName/stats?range=weekly
 */
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
      skill.history.forEach((h) => {
        const diff =
          (now - new Date(h.date)) / (1000 * 60 * 60 * 24);

        if (diff <= days) {
          const day = new Date(h.date)
            .toISOString()
            .split("T")[0];
          stats[day] = (stats[day] || 0) + 1;
        }
      });
    });

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

/**
 * AI INSIGHT
 * GET /api/roadmaps/:roadmapName/insights
 */
router.get("/:roadmapName/insights", authMiddleware, async (req, res) => {
  try {
    const { roadmapName } = req.params;
    const userId = req.userId;

    const roadmap = await Roadmap.findOne({ userId, roadmapName });
    if (!roadmap)
      return res.json({ message: "Start your journey 🚀" });

    const now = new Date();
    let lastWeek = 0;
    let prevWeek = 0;

    roadmap.skills.forEach((skill) => {
      skill.history.forEach((h) => {
        const daysAgo =
          (now - new Date(h.date)) / (1000 * 60 * 60 * 24);

        if (daysAgo <= 7) lastWeek++;
        else if (daysAgo <= 14) prevWeek++;
      });
    });

    let message =
      "Steady pace. Consistency beats intensity.";

    if (lastWeek > prevWeek)
      message = "Momentum detected 🚀 You’re moving faster than last week.";
    else if (lastWeek < prevWeek)
      message =
        "You’re slowing down. One small win today changes the curve.";

    res.json({ message });
  } catch (err) {
    res.status(500).json({ message: "Failed to generate insight" });
  }
});

/**
 * PROGRESS TIMELINE
 * GET /api/roadmaps/:roadmapName/timeline
 */
router.get("/:roadmapName/timeline", authMiddleware, async (req, res) => {
  try {
    const { roadmapName } = req.params;
    const userId = req.userId;

    const roadmap = await Roadmap.findOne({ userId, roadmapName });
    if (!roadmap) return res.json([]);

    const timeline = [];

    roadmap.skills.forEach((skill, name) => {
      skill.history.forEach((h) => {
        timeline.push({
          skill: name,
          status: h.status,
          date: h.date,
        });
      });
    });

    timeline.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    res.json(timeline);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch timeline" });
  }
});

/**
 * EXPORT PDF
 * GET /api/roadmaps/:roadmapName/export
 */
router.get("/:roadmapName/export", authMiddleware, async (req, res) => {
  try {
    const { roadmapName } = req.params;
    const userId = req.userId;

    const roadmap = await Roadmap.findOne({ userId, roadmapName });
    if (!roadmap) return res.status(404).send("No roadmap");

    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${roadmapName}.pdf`
    );

    doc.pipe(res);

    doc.fontSize(20).text(`Roadmap: ${roadmapName}`);
    doc.moveDown();

    roadmap.skills.forEach((skill, name) => {
      doc
        .fontSize(12)
        .text(`${name}: ${skill.completed ? "✅ Completed" : "❌ Pending"}`);
    });

    doc.end();
  } catch (err) {
    res.status(500).send("Failed to export PDF");
  }
});

export default router;
