import express from "express";
import User from "../models/User.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/me", authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId).select("hasTakenTest");
  res.json(user);
});

export default router;
