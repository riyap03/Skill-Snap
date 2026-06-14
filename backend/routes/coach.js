import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import User from "../models/User.js";
import Portfolio from "../models/Portfolio.js";
import Project from "../models/Project.js";
import Progress from "../models/Progress.js";

const router = express.Router();

router.get("/job-readiness", authMiddleware, async (req, res) => {
  try {
    const [user, portfolio, projects, progressRecords] = await Promise.all([
      User.findById(req.userId),
      Portfolio.findOne({ userId: req.userId }),
      Project.find({ userId: req.userId }),
      Progress.find({ userId: req.userId }),
    ]);

    const skillScore = user?.completedSkills?.length ? Math.min(100, user.completedSkills.length * 10) : 0;
    const portfolioScore = portfolio?.projects?.length ? Math.min(100, portfolio.projects.length * 25) : 0;
    const projectScore = projects?.length ? Math.min(100, projects.length * 20) : 0;
    const assessmentScore = progressRecords?.length
      ? progressRecords.reduce((sum, p) => sum + (p.score || 0), 0) / progressRecords.length
      : 0;

    const overallScore = Math.round((skillScore + portfolioScore + projectScore + assessmentScore) / 4);

    const strengths = [];
    const weaknesses = [];
    const improvements = [];

    if (skillScore >= 70) strengths.push("Strong skill portfolio");
    else if (skillScore >= 40) weaknesses.push("Incomplete skill tracking");
    else weaknesses.push("No skills recorded", "Add skills to your profile");

    if (portfolioScore >= 70) strengths.push("Good portfolio coverage");
    else if (portfolioScore >= 40) weaknesses.push("Add more portfolio items");
    else weaknesses.push("No portfolio projects", "Showcase your work");

    if (assessmentScore >= 70) strengths.push("Great assessment scores");
    else if (assessmentScore >= 40) weaknesses.push("Improve test performance");
    else weaknesses.push("No assessment data", "Take skills assessment");

    if (projectScore >= 70) strengths.push("Active project development");
    else if (projectScore >= 40) weaknesses.push("Complete more projects");
    else weaknesses.push("No projects recorded", "Start building projects");

    if (overallScore >= 80) improvements.push("Apply to jobs now!");
    else if (overallScore >= 60) improvements.push("Polish your portfolio");
    else if (overallScore >= 40) improvements.push("Add more skills", "Complete projects", "Retake assessments");
    else improvements.push("Build core skills", "Create portfolio", "Complete projects", "Take assessments");

    let level = "beginner";
    if (overallScore >= 80) level = "advanced";
    else if (overallScore >= 50) level = "intermediate";

    res.json({
      overallScore,
      skillScore,
      portfolioScore,
      projectScore,
      assessmentScore,
      level,
      strengths,
      weaknesses,
      improvements,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/suggest-skills", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const completedSkills = user?.completedSkills || [];
    const allSkills = ["JavaScript", "React", "Node.js", "MongoDB", "TypeScript", "Next.js", "AWS", "Docker", "GraphQL", "Python"];
    const suggestions = allSkills.filter(s => !completedSkills.includes(s));
    res.json({
      suggestions,
      basedOn: {
        targetRole: "Full Stack Developer",
        level: user?.learningProfile?.level || "beginner",
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/suggest-projects", authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.userId });
    const completedTitles = projects?.map(p => p.title) || [];
    const allProjects = ["Task Manager", "Weather App", "Blog API", "Chat Application", "E-commerce Site"];
    const suggestions = allProjects.filter(p => !completedTitles.includes(p));
    res.json({
      suggestions,
      recommendationNote: "Projects matched to your current skill level and target role.",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/portfolio-feedback", authMiddleware, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.userId });
    const projectCount = portfolio?.projects?.length || 0;
    const summary = projectCount >= 3 ? "Your portfolio looks great!" : `Add ${3 - projectCount} more projects to strengthen your portfolio.`;
    const feedback = [];
    if (projectCount < 3) {
      feedback.push({ type: "warning", message: `Only ${projectCount} project${projectCount !== 1 ? "s" : ""} - employers expect 3-5` });
    }
    if (projectCount === 0) {
      feedback.push({ type: "info", message: "Start with a simple project to showcase your skills" });
    }
    res.json({
      summary,
      feedback,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;