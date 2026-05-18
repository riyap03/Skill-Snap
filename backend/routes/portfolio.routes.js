import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";

import Portfolio from "../models/Portfolio.js";
import User from "../models/User.js";
import Roadmap from "../models/Roadmap.js";
import Progress from "../models/Progress.js";

const router = express.Router();

/**
 * GET USER PORTFOLIO
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      userId: req.userId,
    });

    if (!portfolio) {
      return res.json({
        projects: [],
        aiContent: "",
      });
    }

    res.json(portfolio);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch portfolio",
    });
  }
});

/**
 * ADD PROJECT
 */
router.post(
  "/project",
  authMiddleware,
  async (req, res) => {
    try {
      const {
        title,
        description,
        skills,
        date,
        link,
      } = req.body;

   const user = await User.findById(req.userId);

if (!user) {
  return res.status(404).json({
    message: "User not found",
  });
}

      let portfolio = await Portfolio.findOne({
        userId: req.userId,
      });

      if (!portfolio) {
        portfolio = new Portfolio({
          userId: req.userId,
          username: user.name.toLowerCase(),
          projects: [],
        });
      }

      portfolio.projects.unshift({
        title,
        description,
        skills,
        date,
        link,
      });

      await portfolio.save();

      res.json({
        success: true,
        projects: portfolio.projects,
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "Failed to add project",
      });
    }
  }
);

/**
 * DELETE PROJECT
 */
router.delete(
  "/project/:projectId",
  authMiddleware,
  async (req, res) => {
    try {
      const portfolio = await Portfolio.findOne({
        userId: req.userId,
      });

      if (!portfolio) {
        return res.status(404).json({
          message: "Portfolio not found",
        });
      }

      portfolio.projects = portfolio.projects.filter(
        (project) =>
          project._id.toString() !== req.params.projectId
      );

      await portfolio.save();

      res.json({
        success: true,
        projects: portfolio.projects,
      });
    } catch (err) {
      res.status(500).json({
        message: "Failed to delete project",
      });
    }
  }
);

/**
 * GENERATE AI PORTFOLIO
 */
router.post(
  "/generate",
  authMiddleware,
  async (req, res) => {
    try {
      const user = await User.findById(req.userId);

      const portfolio = await Portfolio.findOne({
        userId: req.userId,
      });

      if (!portfolio || portfolio.projects.length === 0) {
        return res.status(400).json({
          message: "Add projects first",
        });
      }

      const roadmaps = await Roadmap.find({
        userId: req.userId,
      });

      const progressData = await Progress.find({
        userId: req.userId,
      });

      const completedSkills = [];

      roadmaps.forEach((roadmap) => {
        roadmap.skills.forEach((skill, name) => {
          if (skill.completed) {
            completedSkills.push(name);
          }
        });
      });

      const totalTests = progressData.length;

      const averageScore =
        totalTests > 0
          ? (
              progressData.reduce(
                (acc, curr) => acc + curr.score,
                0
              ) / totalTests
            ).toFixed(1)
          : 0;

      const aiContent = `
${user.name} is a passionate developer focused on building scalable and modern web applications.

Completed Skills:
${completedSkills.join(", ")}

Projects Built:
${portfolio.projects
  .map((p) => `• ${p.title}`)
  .join("\n")}

Learning Analytics:
• Completed ${completedSkills.length} roadmap skills
• Attempted ${totalTests} assessments
• Average score: ${averageScore}

Technical Strengths:
${[
  ...new Set(
    portfolio.projects.flatMap((p) => p.skills)
  ),
].join(", ")}

Career Summary:
Focused on frontend/backend engineering with strong consistency in practical learning and project development.
`;

      portfolio.aiContent = aiContent;

      await portfolio.save();

      res.json({
        success: true,
        content: aiContent,
        shareUrl: `http://localhost:5173/portfolio/${portfolio.username}`,
      });
    } catch (err) {
      console.log(err);

      res.status(500).json({
        message: "Failed to generate portfolio",
      });
    }
  }
);

/**
 * PUBLIC PORTFOLIO
 */
router.get("/:username", async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      username: req.params.username,
    });

    if (!portfolio) {
      return res.status(404).json({
        message: "Portfolio not found",
      });
    }

    res.json(portfolio);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch portfolio",
    });
  }
});

export default router;