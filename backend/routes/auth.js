import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

import authMiddleware from "../middleware/auth.middleware.js";
import User from "../models/User.js";

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

const normalizeEmail = (email = "") => email.trim().toLowerCase();

const isValidEmail = (email) => emailRegex.test(email);

const createToken = (user) =>
  jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const sendAuthResponse = (res, user, status = 200) =>
  res.status(status).json({
    userId: user._id,
    name: user.name,
    email: user.email,
    token: createToken(user),
  });

/**
 * SIGNUP
 * POST /api/auth/register
 */
router.post("/register", async (req, res) => {
  try {
    const name = req.body.name?.trim();
    const email = normalizeEmail(req.body.email);
    const { password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Enter a valid email address" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      authProvider: "local",
    });

    sendAuthResponse(res, user, 201);
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
});

/**
 * LOGIN
 * POST /api/auth/login
 */
router.post("/login", async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Enter a valid email address" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.password) {
      return res.status(400).json({ message: "This account uses Google sign-in" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    sendAuthResponse(res, user);
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

/**
 * GOOGLE SIGN IN / SIGN UP
 * POST /api/auth/google
 */
router.post("/google", async (req, res) => {
  try {
    const { credential } = req.body;

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({ message: "Google auth is not configured" });
    }

    if (!credential) {
      return res.status(400).json({ message: "Google credential is required" });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const email = normalizeEmail(payload?.email);

    if (!payload?.email_verified || !isValidEmail(email)) {
      return res.status(400).json({ message: "Google email could not be verified" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: payload.name || email.split("@")[0],
        email,
        authProvider: "google",
        googleId: payload.sub,
      });
    } else if (!user.googleId) {
      user.googleId = payload.sub;
      user.authProvider = user.authProvider || "google";
      await user.save();
    }

    sendAuthResponse(res, user);
  } catch (err) {
    res.status(401).json({ message: "Google sign-in failed", error: err.message });
  }
});

router.delete("/delete", authMiddleware, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.userId);
    res.json({ message: "Account deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete account" });
  }
});

export default router;
