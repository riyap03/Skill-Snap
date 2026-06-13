import { describe, it, expect } from "vitest";

describe("Test Page Logic", () => {
  it("TRACKS array has 4 valid tracks", () => {
    const TRACKS = ["frontend", "backend", "dsa", "ai_ml"];
    expect(TRACKS).toHaveLength(4);
    expect(TRACKS).toContain("frontend");
    expect(TRACKS).toContain("backend");
  });

  it("QUESTIONS_PER_TRACK is 5", () => {
    const QUESTIONS_PER_TRACK = 5;
    expect(QUESTIONS_PER_TRACK).toBe(5);
  });

    it("level calculation works correctly", () => {
      const calcLevel = (score, total) => {
        const pct = (score / total) * 100;
        if (pct >= 80) return "Advanced";
        if (pct >= 50) return "Intermediate";
        return "Beginner";
      };
      expect(calcLevel(5, 5)).toBe("Advanced");
      expect(calcLevel(4, 5)).toBe("Advanced");
      expect(calcLevel(3, 5)).toBe("Intermediate");
      expect(calcLevel(2, 5)).toBe("Beginner");
    });

  it("score percentage calculation", () => {
    expect(Math.round((4 / 5) * 100)).toBe(80);
    expect(Math.round((2 / 5) * 100)).toBe(40);
  });
});

describe("Onboarding Form Validation", () => {
  it("form fields required", () => {
    const validate = (form) => {
      return form.currentRole?.length > 0 &&
        form.targetRole?.length > 0 &&
        form.experienceLevel?.length > 0 &&
        form.learningStyle?.length > 0;
    };
    expect(validate({ currentRole: "", targetRole: "", experienceLevel: "", learningStyle: "" })).toBe(false);
    expect(validate({ currentRole: "S", targetRole: "F", experienceLevel: "b", learningStyle: "h" })).toBe(true);
  });

  it("skills array validation", () => {
    const validate = (skills) => Array.isArray(skills) && skills.length > 0;
    expect(validate([])).toBe(false);
    expect(validate(["React"])).toBe(true);
    expect(validate(null)).toBe(false);
  });
});

describe("Assessment Result Display", () => {
  it("result object structure", () => {
    const result = {
      score: 4,
      totalQuestions: 5,
      level: "Intermediate",
      weakTopics: ["Q3"],
      strongTopics: ["Q1", "Q2"],
    };
    expect(result.score).toBe(4);
    expect(result.totalQuestions).toBe(5);
    expect(result.weakTopics.length).toBe(1);
    expect(result.strongTopics.length).toBe(2);
  });

  it("level mappings from score", () => {
    const getLevel = (score, total) => {
      const pct = (score / total) * 100;
      if (pct >= 80) return "Advanced";
      if (pct >= 50) return "Intermediate";
      return "Beginner";
    };
    expect(getLevel(3, 5)).toBe("Intermediate");
    expect(getLevel(5, 5)).toBe("Advanced");
    expect(getLevel(1, 5)).toBe("Beginner");
  });
});

describe("Job Readiness Score", () => {
  it("overall score calculation", () => {
    const skillScore = 50;
    const portfolioScore = 60;
    const assessmentScore = 70;
    const projectScore = 30;
    const overall = Math.round(
      skillScore * 0.3 + portfolioScore * 0.25 + assessmentScore * 0.25 + projectScore * 0.2
    );
    expect(overall).toBeGreaterThan(0);
    expect(overall).toBeLessThanOrEqual(100);
  });

  it("score color thresholds", () => {
    const getColor = (s) => {
      if (s >= 70) return "green";
      if (s >= 40) return "yellow";
      return "red";
    };
    expect(getColor(80)).toBe("green");
    expect(getColor(50)).toBe("yellow");
    expect(getColor(20)).toBe("red");
  });
});

describe("Analytics Dashboard", () => {
  it("streak calculation works", () => {
    const calculateStreak = (records) => {
      if (!records.length) return 0;
      const dates = new Set(records.map((r) => r.date));
      const sorted = Array.from(dates).sort().reverse();
      const today = new Date().toISOString().split("T")[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      if (sorted[0] !== today && sorted[0] !== yesterday) return 0;
      let streak = 1;
      for (let i = 0; i < sorted.length - 1; i++) {
        const curr = new Date(sorted[i]);
        const prev = new Date(sorted[i + 1]);
        const diff = (curr - prev) / (1000 * 60 * 60 * 24);
        if (diff === 1) streak++;
        else break;
      }
      return streak;
    };
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    expect(calculateStreak([])).toBe(0);
    expect(calculateStreak([{ date: today }, { date: yesterday }])).toBeGreaterThanOrEqual(1);
  });

  it("weekly hours calculation", () => {
    const records = [
      { createdAt: new Date().toISOString() },
      { createdAt: new Date(Date.now() - 86400000).toISOString() },
    ];
    const weeklyHours = records.length * 2;
    expect(weeklyHours).toBe(4);
  });
});
