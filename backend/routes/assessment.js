import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import User from "../models/User.js";
import AssessmentResult from "../models/AssessmentResult.js";
import Roadmap from "../models/Roadmap.js";
import { ASSESSMENT_QUESTIONS, SKILL_TEST_QUESTIONS } from "../src/data/assessmentQuestions.js";
import { CODING_CHALLENGES } from "../src/data/codingChallenges.js";
import { ROADMAPS } from "../src/data/roadmap.js";

const router = express.Router();

const shuffleArray = (arr) => {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const pickQuestions = (track, count = 5) => {
  const all = ASSESSMENT_QUESTIONS[track] || [];
  return shuffleArray(all).slice(0, Math.min(count, all.length));
};

const pickSkillTestQuestions = (count = 8) => {
  return shuffleArray(SKILL_TEST_QUESTIONS).slice(0, Math.min(count, SKILL_TEST_QUESTIONS.length));
};

const pickRandomChallenge = () => {
  const all = CODING_CHALLENGES;
  const idx = Math.floor(Math.random() * all.length);
  return all[idx];
};

const inferWeakTopics = (track, questions, answers) => {
  const weak = new Set();
  questions.forEach((q, i) => {
    const chosen = answers[i];
    const correctOption = q.options.find((o) => o.correct);
    if (chosen === undefined || q.options[chosen]?.correct !== true) {
      weak.add(q.question.split(" ").slice(0, 4).join(" "));
    }
  });
  return [...weak].slice(0, 3);
};

const inferStrongTopics = (track, questions, answers) => {
  const strong = new Set();
  questions.forEach((q, i) => {
    const chosen = answers[i];
    if (q.options[chosen]?.correct === true) {
      strong.add(q.question.split(" ").slice(0, 4).join(" "));
    }
  });
  return [...strong].slice(0, 3);
};

const getWeakSkillsFromRoadmap = async (userId) => {
  const roadmap = await Roadmap.findOne({ userId }).lean();
  return roadmap ? roadmap.skills : {};
};

router.get("/questions", async (req, res) => {
  try {
    const { track } = req.query;
    const questions = pickQuestions(track || "frontend", 5);
    res.json({ track: track || "frontend", questions });
  } catch (err) {
    res.status(500).json({ message: "Failed to load questions" });
  }
});

router.post("/submit", authMiddleware, async (req, res) => {
  try {
    const { track, correctAnswers, totalQuestions, timeTaken = 0, answers = [] } = req.body;
    const questions = ASSESSMENT_QUESTIONS[track] || [];
    const picked = pickQuestions(track, totalQuestions || 5);
    const accuracy = totalQuestions ? (correctAnswers / totalQuestions) * 100 : 0;
    const speedScore = Math.max(0, 100 - (timeTaken || 0));
    let level = "beginner";
    if (accuracy > 80) level = "advanced";
    else if (accuracy > 50) level = "intermediate";

    const strong = inferStrongTopics(track, picked, answers);
    const weak = inferWeakTopics(track, picked, answers);

    await AssessmentResult.create({
      userId: req.userId,
      type: "core",
      track,
      score: correctAnswers,
      totalQuestions: totalQuestions || picked.length,
      correctAnswers,
      timeTaken,
      accuracy: Math.round(accuracy),
      speedScore,
      level,
      answers,
      strongTopics: strong,
      weakTopics: weak,
    });

    await User.findByIdAndUpdate(req.userId, {
      hasTakenTest: true,
      learningProfile: {
        level,
        accuracyScore: accuracy,
        speedScore,
      },
    });

    res.json({ level, accuracy: Math.round(accuracy), speedScore, strongTopics: strong, weakTopics: weak });
  } catch (err) {
    res.status(500).json({ message: "Submission failed" });
  }
});

router.get("/results", authMiddleware, async (req, res) => {
  try {
    const results = await AssessmentResult.find({ userId: req.userId }).sort({ createdAt: -1 });
    const latest = results[0];
    if (!latest) {
      return res.json({ assessmentResults: {}, learningProfile: {} });
    }

    const byTrack = {};
    results.forEach((r) => {
      if (r.type === "core" && r.track) {
        byTrack[r.track] = Math.round(r.accuracy);
      }
    });

    const user = await User.findById(req.userId).lean();
    res.json({
      assessmentResults: {
        frontendScore: byTrack.frontend || 0,
        backendScore: byTrack.backend || 0,
        dsaScore: byTrack.dsa || 0,
        aiMlScore: byTrack.ai_ml || 0,
        strongSkills: latest.strongTopics,
        weakSkills: latest.weakTopics,
      },
      learningProfile: user?.learningProfile || {},
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch results" });
  }
});

router.get("/adaptive", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).lean();
    const { roadmapName } = req.query;
    const profile = user?.learningProfile || {};
    const level = profile.level || "beginner";

    const baseSkills = ROADMAPS[roadmapName] || Object.values(ROADMAPS).flat();
    const allQuestions = Object.values(ASSESSMENT_QUESTIONS).flat();
    const matched = allQuestions.filter((q) => baseSkills.some((s) => q.question.toLowerCase().includes(s.toLowerCase().split(" ")[0])));

    const questions = matched.length >= 5 ? shuffleArray(matched).slice(0, 5) : shuffleArray(allQuestions).slice(0, 5);

    const pendingSkills = baseSkills.slice(0, 6);

    res.json({
      roadmapName: roadmapName || "general",
      totalPending: pendingSkills.length,
      level,
      accuracyScore: Math.round(profile.accuracyScore || 0),
      speedScore: Math.round(profile.speedScore || 0),
      pendingSkills,
      questions,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to generate adaptive assessment" });
  }
});

router.post("/adaptive/submit", authMiddleware, async (req, res) => {
  try {
    const { answers = [], timeTaken = 0, pendingSkills = [] } = req.body;

    const questions = req.body.questions || [];
    let correctCount = 0;
    answers.forEach((a) => {
      const q = questions.find((qq) => qq.id === a.questionId);
      if (q && q.options[a.answerIndex]?.correct) correctCount++;
    });
    const total = answers.length || questions.length || 5;
    const accuracy = total ? (correctCount / total) * 100 : 0;
    const speedScore = Math.max(0, 100 - timeTaken);
    let level = "beginner";
    if (accuracy > 80) level = "advanced";
    else if (accuracy > 50) level = "intermediate";

    await AssessmentResult.create({
      userId: req.userId,
      type: "adaptive",
      score: correctCount,
      totalQuestions: total,
      correctAnswers: correctCount,
      timeTaken,
      accuracy: Math.round(accuracy),
      speedScore,
      level,
      answers,
    });

    await User.findByIdAndUpdate(req.userId, {
      hasTakenTest: true,
      learningProfile: { level, accuracyScore: accuracy, speedScore },
    });

    res.json({ correctAnswers: correctCount, totalQuestions: total, accuracy: Math.round(accuracy), speedScore, level });
  } catch (err) {
    res.status(500).json({ message: "Adaptive submission failed" });
  }
});

router.get("/coding-questions", authMiddleware, async (req, res) => {
  try {
    const challenge = pickRandomChallenge();
    res.json({ challenges: [challenge] });
  } catch (err) {
    res.status(500).json({ message: "Failed to load coding challenge" });
  }
});

router.post("/coding/submit", authMiddleware, async (req, res) => {
  try {
    const { challengeId, code, output, timeTaken = 0, attempts = 1, errors = 0 } = req.body;
    const challenge = CODING_CHALLENGES.find((c) => c.id === challengeId) || CODING_CHALLENGES[0];

    const normalize = (text) => {
      if (!text) return "";
      return text
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        .split("\n")
        .map((line) => line.trimEnd())
        .join("\n")
        .trim();
    };

    const normalizeJs = (text) => {
      const normalized = normalize(text);
      return normalized
        .replace(/^undefined[\s\S]*/i, "")
        .replace(/^\[.*?\]\s*/i, "")
        .replace(/\s*undefined\s*/i, "")
        .trim();
    };

    const normalizePy = (text) => {
      const normalized = normalize(text);
      const lines = normalized.split("\n");
      const cleaned = [];
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        if (trimmed.startsWith("#")) continue;
        if (trimmed.startsWith("def ")) continue;
        if (trimmed.startsWith("import ")) continue;
        if (trimmed.startsWith("from ")) continue;
        if (trimmed.startsWith("return ")) continue;
        if (trimmed.startsWith("print(") && trimmed.includes("The factorial of")) continue;
        cleaned.push(trimmed);
      }
      return cleaned.join("\n").trim();
    };

    const expected = normalize(challenge.expectedOutput);
    const raw = normalize(output);
    const expectedLower = expected.toLowerCase();
    const actualJs = normalizeJs(raw).toLowerCase();
    const actualPy = normalizePy(raw).toLowerCase();

    const isJsLike = /console\.log|let |const |var |function |=>|require\(|import |document\.|window\.|\.log\(/.test(code || "");
    const isPyLike = /def |print\(|import |from |if __name__|elif|range\(|\.append\(/.test(code || "");

    let correct = false;
    if (actualJs === expectedLower) correct = true;
    else if (actualPy === expectedLower) correct = true;
    else if (raw.toLowerCase() === expectedLower) correct = true;
    else if (isJsLike && actualJs.includes(expectedLower)) correct = true;
    else if (isPyLike && actualPy.includes(expectedLower)) correct = true;
    else if (expectedLower && (actualJs.includes(expectedLower) || actualPy.includes(expectedLower) || raw.toLowerCase().includes(expectedLower))) correct = true;

    const accuracy = correct ? 100 : 0;
    const speedScore = Math.max(0, 100 - timeTaken);
    let level = "beginner";
    if (accuracy > 80 && attempts <= 2) level = "advanced";
    else if (accuracy > 50) level = "intermediate";

    await AssessmentResult.create({
      userId: req.userId,
      type: "coding",
      track: "coding",
      accuracy,
      speedScore,
      level,
      timeTaken,
      codingData: {
        challengeId,
        code,
        output,
        attempts,
        errors,
        correct,
      },
    });

    res.json({
      correct,
      message: correct ? "Correct output! Well done." : "Output did not match. Review the expected output and try again.",
      expectedOutput: challenge.expectedOutput,
    });
  } catch (err) {
    res.status(500).json({ message: "Coding submission failed" });
  }
});

router.get("/skill-test", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).lean();
    if (user?.hasTakenTest) {
      const past = await AssessmentResult.findOne({ userId: req.userId, type: "skill_test" }).sort({ createdAt: -1 }).lean();
      return res.json({ alreadyTaken: true, result: past || null });
    }

    const questions = pickSkillTestQuestions(8);
    res.json({ questions, alreadyTaken: false });
  } catch (err) {
    res.status(500).json({ message: "Failed to load skill test" });
  }
});

router.post("/skill-test/submit", authMiddleware, async (req, res) => {
  try {
    const { answers = [], timeTaken = 0 } = req.body;
    const questions = pickSkillTestQuestions(8);
    let correctCount = 0;
    const detailedAnswers = [];

    questions.forEach((q, i) => {
      const chosen = answers[i];
      const isCorrect = q.options[chosen]?.correct === true;
      if (isCorrect) correctCount++;
      detailedAnswers.push({ questionId: q.id, answerIndex: chosen });
    });

    const total = questions.length;
    const accuracy = total ? (correctCount / total) * 100 : 0;
    const speedScore = Math.max(0, 100 - timeTaken);
    let level = "beginner";
    if (accuracy > 80) level = "advanced";
    else if (accuracy > 50) level = "intermediate";

    const strong = inferStrongTopics("general", questions, answers);
    const weak = inferWeakTopics("general", questions, answers);

    await AssessmentResult.create({
      userId: req.userId,
      type: "skill_test",
      track: "general",
      score: correctCount,
      totalQuestions: total,
      correctAnswers: correctCount,
      timeTaken,
      accuracy: Math.round(accuracy),
      speedScore,
      level,
      answers: detailedAnswers,
      strongTopics: strong,
      weakTopics: weak,
    });

    await User.findByIdAndUpdate(req.userId, {
      hasTakenTest: true,
      learningProfile: { level, accuracyScore: accuracy, speedScore },
    });

    res.json({ correctAnswers: correctCount, totalQuestions: total, accuracy: Math.round(accuracy), speedScore, level, strongTopics: strong, weakTopics: weak });
  } catch (err) {
    res.status(500).json({ message: "Skill test submission failed" });
  }
});

export default router;
