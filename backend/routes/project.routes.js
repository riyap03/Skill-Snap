import express from "express";
import Project from "../../models/Project.js";
import { protect } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  const projects = await Project.find({ userId: req.userId });
  res.json(projects);
});

router.post("/", protect, async (req, res) => {
  const project = await Project.create({
    ...req.body,
    userId: req.userId,
  });
  res.json(project);
});


export default router;
