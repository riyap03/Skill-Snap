import express from "express";
import Project from "../models/Project.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  const projects = await Project.find({ userId: req.userId });
  res.json(projects);
});

router.post("/", authMiddleware, async (req, res) => {
  const project = await Project.create({
    ...req.body,
    userId: req.userId,
  });
  res.json(project);
});


export default router;
