import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../config/api";
import {
  ArrowRight,
  Code2,
  FlaskConical,
  Loader2,
  Play,
  RotateCcw,
  Sparkles,
  Zap,
} from "lucide-react";

const CORE_TRACKS = [
  {
    key: "frontend",
    label: "Frontend Development",
    color: "from-blue-500 to-cyan-400",
    desc: "React, CSS, JS, HTML, state management",
  },
  {
    key: "backend",
    label: "Backend Development",
    color: "from-emerald-500 to-teal-400",
    desc: "Node.js, Express, databases, APIs",
  },
  {
    key: "dsa",
    label: "Data Structures & Algorithms",
    color: "from-orange-500 to-yellow-400",
    desc: "Arrays, trees, graphs, algorithms",
  },
  {
    key: "ai_ml",
    label: "AI & Machine Learning",
    color: "from-purple-500 to-pink-400",
    desc: "ML basics, neural networks, data preprocessing",
  },
];

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const EXPECTED_MATCHES = {
  "cc-1": ["1\n2\nfizz\n4\nbuzz", "1\n2\nFizz\n4\nBuzz", "fizz", "buzz", "fizzbuzz"],
  "cc-2": ["true", "false"],
  "cc-3": ["55"],
  "cc-4": ["0\n1", "0", "1"],
  "cc-5": ["120"],
  "cc-6": ["panlliks"],
  "cc-7": ["8"],
  "cc-8": ["true", "false"],
  "cc-9": ["9"],
  "cc-10": ["0\n1\n1\n2\n3\n5\n8\n13\n21\n34"],
};

const CODING_LANGUAGES = [
  { key: "javascript", label: "JavaScript", runnable: true },
  { key: "typescript", label: "TypeScript", runnable: true },
  { key: "python", label: "Python", runnable: false },
  { key: "java", label: "Java", runnable: false },
  { key: "cpp", label: "C++", runnable: false },
  { key: "c", label: "C", runnable: false },
  { key: "csharp", label: "C#", runnable: false },
  { key: "go", label: "Go", runnable: false },
  { key: "ruby", label: "Ruby", runnable: false },
  { key: "php", label: "PHP", runnable: false },
  { key: "swift", label: "Swift", runnable: false },
  { key: "kotlin", label: "Kotlin", runnable: false },
];

const starterForLanguage = (challenge, language) => {
  const args = challenge?.inputLabel || "input";
  const title = challenge?.title || "Challenge";
  const jsStarter = challenge?.starterCode || `function solve(${args}) {\n  // Write your solution here.\n}\n`;
  const templates = {
    javascript: jsStarter,
    typescript: jsStarter,
    python: `def solve(${args}):\n    # Write your solution for ${title} here\n    pass\n`,
    java: `class Solution {\n    public Object solve(Object ${args.split(",")[0]?.trim() || "input"}) {\n        // Write your solution for ${title} here\n        return null;\n    }\n}\n`,
    cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\n// Write your solution for ${title} here\n// Example: auto solve(${args}) { }\n`,
    c: `#include <stdio.h>\n\n/* Write your solution for ${title} here */\n`,
    csharp: `public class Solution {\n    public object Solve(object ${args.split(",")[0]?.trim() || "input"}) {\n        // Write your solution for ${title} here\n        return null;\n    }\n}\n`,
    go: `package main\n\n// Write your solution for ${title} here\n// func solve(${args}) any { return nil }\n`,
    ruby: `def solve(${args})\n  # Write your solution for ${title} here\nend\n`,
    php: `<?php\nfunction solve(${args.split(",").map((arg) => `$${arg.trim() || "input"}`).join(", ")}) {\n    // Write your solution for ${title} here\n}\n`,
    swift: `func solve(_ input: Any) -> Any {\n    // Write your solution for ${title} here\n    return input\n}\n`,
    kotlin: `fun solve(input: Any): Any {\n    // Write your solution for ${title} here\n    return input\n}\n`,
  };
  return templates[language] || jsStarter;
};

export default function AssessmentPage() {
  const { track: urlTrack } = useParams();

  const [activeTab, setActiveTab] = useState(() =>
    urlTrack ? "core" : "adaptive"
  );
  const [adaptive, setAdaptive] = useState(null);
  const [adaptiveQuestions, setAdaptiveQuestions] = useState([]);
  const [adaptiveAnswers, setAdaptiveAnswers] = useState({});

  const [coreTrack, setCoreTrack] = useState(urlTrack || null);
  const [coreQuestions, setCoreQuestions] = useState([]);
  const [coreIndex, setCoreIndex] = useState(0);
  const [coreScore, setCoreScore] = useState(0);
  const [coreResult, setCoreResult] = useState(null);
  const [coreLoading, setCoreLoading] = useState(false);

  const [coding, setCoding] = useState(null);
  const [codingResult, setCodingResult] = useState(null);
  const [codingLanguage, setCodingLanguage] = useState("javascript");
  const [codingCode, setCodingCode] = useState("");
  const [codingOutput, setCodingOutput] = useState("");
  const [codingTestResults, setCodingTestResults] = useState([]);
  const [codingAttempts, setCodingAttempts] = useState(0);
  const [codingErrors, setCodingErrors] = useState(0);
  const [codingTimer, setCodingTimer] = useState(0);

  const [adaptiveResult, setAdaptiveResult] = useState(null);
  const [adaptiveTimer, setAdaptiveTimer] = useState(0);
  const [adaptiveQIndex, setAdaptiveQIndex] = useState(0);
  const [adaptiveSubmitting, setAdaptiveSubmitting] = useState(false);
  const [adaptiveLoading, setAdaptiveLoading] = useState(false);

  const [codingLoading, setCodingLoading] = useState(false);
  const [codingSubmitting, setCodingSubmitting] = useState(false);
  const [coreTimerState, setCoreTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (adaptiveQuestions.length && !adaptiveResult) {
      interval = setInterval(() => setAdaptiveTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [adaptiveQuestions, adaptiveResult]);

  useEffect(() => {
    let interval;
    if (coreQuestions.length && !coreResult && activeTab === "core") {
      interval = setInterval(() => setCoreTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [coreQuestions, coreResult, activeTab]);

  useEffect(() => {
    let interval;
    if (coding && activeTab === "coding" && !codingResult?.correct) {
      interval = setInterval(() => setCodingTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [coding, activeTab, codingResult?.correct]);

  useEffect(() => {
    if (urlTrack && activeTab === "core" && !coreQuestions.length) {
      loadCoreTrack(urlTrack);
    }
  }, [urlTrack]);

  const loadAdaptive = async () => {
    setAdaptiveLoading(true);
    setAdaptiveResult(null);
    setAdaptiveAnswers({});
    setAdaptiveQuestions([]);
    setAdaptiveTimer(0);
    setAdaptiveQIndex(0);
    try {
      const res = await axios.get(apiUrl("/api/assessment/adaptive"), {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAdaptive(res.data);
      setAdaptiveQuestions(res.data.questions || []);
    } catch {
      setAdaptiveResult({ error: "Failed to generate roadmap assessment." });
    } finally {
      setAdaptiveLoading(false);
    }
  };

  const submitAdaptive = async () => {
    if (!adaptiveQuestions.length) return;
    setAdaptiveSubmitting(true);
    try {
      const answers = adaptiveQuestions.map((q) => ({
        questionId: q.id,
        answerIndex: adaptiveAnswers[q.id],
      }));
      const res = await axios.post(
        apiUrl("/api/assessment/adaptive/submit"),
        {
          answers,
          questions: adaptiveQuestions,
          timeTaken: adaptiveTimer,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setAdaptiveResult(res.data);
    } catch {
      setAdaptiveResult({ error: "Failed to submit roadmap assessment." });
    } finally {
      setAdaptiveSubmitting(false);
    }
  };

  const loadCoding = async () => {
    setCodingLoading(true);
    setCodingResult(null);
    setCodingCode("");
    setCodingOutput("");
    setCodingTestResults([]);
    setCodingAttempts(0);
    setCodingErrors(0);
    setCodingTimer(0);
    try {
      const res = await axios.get(apiUrl("/api/assessment/coding-questions"), {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const nextChallenge = res.data.challenges?.[0] || null;
      setCoding(nextChallenge);
      setCodingCode(starterForLanguage(nextChallenge, codingLanguage));
    } catch {
      setCodingResult({ error: "Failed to load coding challenge." });
    } finally {
      setCodingLoading(false);
    }
  };

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

  const isCorrectFor = (challengeId, raw) => {
    const text = normalize(raw).toLowerCase();
    if (!text) return false;
    const matches = EXPECTED_MATCHES[challengeId] || [];
    return matches.some((expected) => {
      const expectedNorm = normalize(expected).toLowerCase();
      return expectedNorm && text.includes(expectedNorm);
    });
  };

  const stableStringify = (value) => {
    if (typeof value === "string") return value.trim();
    return JSON.stringify(value);
  };

  const valuesEqual = (actual, expected) => {
    if (Array.isArray(expected)) {
      if (typeof actual === "string") {
        const lines = actual.split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean);
        return stableStringify(lines) === stableStringify(expected.map(String));
      }
      return stableStringify(actual) === stableStringify(expected);
    }
    if (typeof expected === "boolean") {
      if (typeof actual === "string") return actual.toLowerCase() === String(expected);
      return actual === expected;
    }
    return stableStringify(actual) === stableStringify(expected);
  };

  const runCodingTests = () => {
    if (!coding) return;
    const activeLanguage = CODING_LANGUAGES.find((language) => language.key === codingLanguage);
    if (!activeLanguage?.runnable) {
      setCodingResult({
        error: `${activeLanguage?.label || "This language"} cannot run inside the browser yet. Run it locally and paste the output below, then submit.`,
      });
      return;
    }
    const logs = [];
    const originalLog = console.log;
    const results = [];

    try {
      console.log = (...args) => logs.push(args.join(" "));
      const runner = new Function(`${codingCode}; return typeof solve === "function" ? solve : null;`);
      const solve = runner();

      if (!solve) {
        throw new Error("Define a function named solve.");
      }

      (coding.testCases || []).forEach((testCase, index) => {
        try {
          logs.length = 0;
          const actual = solve(...(testCase.input || []));
          const actualValue = actual === undefined && logs.length ? logs.join("\n") : actual;
          results.push({
            index,
            input: testCase.input,
            expected: testCase.expected,
            actual: actualValue,
            passed: valuesEqual(actualValue, testCase.expected),
          });
        } catch (err) {
          results.push({
            index,
            input: testCase.input,
            expected: testCase.expected,
            actual: err.message,
            passed: false,
          });
        }
      });
    } catch (err) {
      const fallbackResults = (coding.testCases || []).map((testCase, index) => ({
        index,
        input: testCase.input,
        expected: testCase.expected,
        actual: err.message,
        passed: false,
      }));
      results.push(...fallbackResults);
    } finally {
      console.log = originalLog;
    }

    const passed = results.filter((result) => result.passed).length;
    const output = results.map((result) => `Case ${result.index + 1}: ${result.passed ? "Passed" : "Failed"} | Expected ${stableStringify(result.expected)} | Got ${stableStringify(result.actual)}`).join("\n");
    const correct = results.length > 0 && passed === results.length;
    setCodingTestResults(results);
    setCodingOutput(output);
    setCodingResult({
      correct,
      message: correct ? "All tests passed!" : `${passed}/${results.length} tests passed.`,
      expectedOutput: coding.expectedOutput,
      actualOutput: output,
    });
    setCodingAttempts((prev) => prev + 1);
    setCodingErrors(correct ? codingErrors : codingErrors + 1);
  };

  const submitCoding = async () => {
    if (!coding) return;
    setCodingSubmitting(true);
    const nextAttempts = codingAttempts + 1;
    const currentResults = codingTestResults.length ? codingTestResults : [];
    const correct = currentResults.length
      ? currentResults.every((result) => result.passed)
      : isCorrectFor(coding.id, codingOutput);
    const nextErrors = correct ? codingErrors : codingErrors + 1;
    try {
      const res = await axios.post(
        apiUrl("/api/assessment/coding/submit"),
        {
          challengeId: coding.id,
          code: codingCode,
          language: codingLanguage,
          output: codingOutput,
          testResults: currentResults,
          timeTaken: codingTimer,
          attempts: nextAttempts,
          errors: nextErrors,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setCodingAttempts(nextAttempts);
      setCodingErrors(nextErrors);
      setCodingResult({
        correct: res.data.correct,
        message: res.data.message,
        expectedOutput: coding.expectedOutput,
        actualOutput: codingOutput,
        ...res.data,
      });
    } catch {
      setCodingResult({ error: "Failed to submit coding challenge." });
    } finally {
      setCodingSubmitting(false);
    }
  };

  const loadCoreTrack = async (trackKey) => {
    if (!trackKey) return;
    setCoreLoading(true);
    setCoreResult(null);
    setCoreTrack(trackKey);
    setCoreQuestions([]);
    setCoreIndex(0);
    setCoreScore(0);
    setCoreTimer(0);
    setActiveTab("core");
    try {
      const res = await axios.get(
        apiUrl(`/api/assessment/questions?track=${trackKey}`)
      );
      setCoreQuestions(res.data.questions || []);
    } catch {
      setCoreResult({ error: "Failed to load core track." });
    } finally {
      setCoreLoading(false);
    }
  };

  const handleCoreAnswer = (optionIndex) => {
    if (coreIndex >= coreQuestions.length) return;
    const q = coreQuestions[coreIndex];
    if (!q) return;
    const isCorrect = q.options[optionIndex]?.correct;
    const nextIndex = coreIndex + 1;
    const nextScore = isCorrect ? coreScore + 1 : coreScore;
    setCoreScore(nextScore);
    setCoreIndex(nextIndex);
  };

  const submitCore = async () => {
    if (!coreQuestions.length) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        apiUrl("/api/assessment/submit"),
        {
          track: coreTrack,
          correctAnswers: coreScore,
          totalQuestions: coreQuestions.length,
          timeTaken: coreTimerState,
          answers: coreQuestions.map((_, i) => i),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCoreResult(res.data);
    } catch {
      setCoreResult({ error: "Failed to submit core track." });
    }
  };

  const currentCoreQ = coreQuestions[coreIndex];
  const coreProgress = coreQuestions.length
    ? Math.round((coreIndex / coreQuestions.length) * 100)
    : 0;
  const currentAdaptiveQ = adaptiveQuestions[adaptiveQIndex];
  const activeCodingLanguage = CODING_LANGUAGES.find((language) => language.key === codingLanguage) || CODING_LANGUAGES[0];
  const canRunCodingInBrowser = !!activeCodingLanguage.runnable;

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="text-center mb-10">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-brand grid place-items-center shadow-sm">
            <Zap className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="mt-5 text-3xl font-display font-bold tracking-tight">
            Adaptive Assessments
          </h1>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
            Take questions generated from your roadmap progress, then practice
            coding challenges that track speed, attempts, and errors.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-3 mb-8">
          <button
            onClick={() => setActiveTab("adaptive")}
            className={`card-glow rounded-2xl p-4 text-left ${
              activeTab === "adaptive" ? "border-primary/70" : ""
            }`}
          >
            <Sparkles className="h-5 w-5 text-primary mb-2" />
            <h3 className="font-semibold">Roadmap Progress</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Questions adapt to pending roadmap skills.
            </p>
          </button>
          <button
            onClick={() => setActiveTab("core")}
            className={`card-glow rounded-2xl p-4 text-left ${
              activeTab === "core" ? "border-primary/70" : ""
            }`}
          >
            <FlaskConical className="h-5 w-5 text-primary mb-2" />
            <h3 className="font-semibold">Core Tracks</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Frontend, backend, DSA, and AI/ML tests.
            </p>
          </button>
          <button
            onClick={() => setActiveTab("coding")}
            className={`card-glow rounded-2xl p-4 text-left ${
              activeTab === "coding" ? "border-primary/70" : ""
            }`}
          >
            <Code2 className="h-5 w-5 text-primary mb-2" />
            <h3 className="font-semibold">Coding Challenge</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Track output, speed, attempts, and errors.
            </p>
          </button>
        </div>

        {activeTab === "adaptive" && (
          <section className="card-glow rounded-3xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-display font-bold">
                  Roadmap-based assessment
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Generate questions from the skills you have not completed yet.
                </p>
              </div>
              <button
                onClick={loadAdaptive}
                disabled={adaptiveLoading || adaptiveSubmitting}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-4 py-2.5 text-sm text-primary-foreground disabled:opacity-60"
              >
                {adaptiveLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RotateCcw className="h-4 w-4" />
                )}
                {adaptiveLoading ? "Generating..." : "Generate from roadmap"}
              </button>
            </div>

            {adaptive && !adaptiveResult && (
              <div className="grid sm:grid-cols-3 gap-3 mb-6">
                <div className="rounded-2xl border border-border bg-surface/50 p-4">
                  <div className="text-xs text-muted-foreground">
                    Pending skills
                  </div>
                  <div className="text-2xl font-display font-bold">
                    {adaptive.totalPending}
                  </div>
                </div>
                <div className="rounded-2xl border border-border bg-surface/50 p-4">
                  <div className="text-xs text-muted-foreground">Time</div>
                  <div className="text-2xl font-display font-bold">
                    {formatTime(adaptiveTimer)}
                  </div>
                </div>
                <div className="rounded-2xl border border-border bg-surface/50 p-4">
                  <div className="text-xs text-muted-foreground">Level</div>
                  <div className="text-2xl font-display font-bold capitalize">
                    {adaptive.level}
                  </div>
                </div>
              </div>
            )}

            {!adaptiveQuestions.length && !adaptiveLoading && !adaptiveResult && (
              <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                Generate an adaptive assessment to start.
              </div>
            )}

            {adaptiveLoading && (
              <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin mr-2" /> Generating
                questions...
              </div>
            )}

            {!!adaptiveQuestions.length && !adaptiveResult && (
              <div className="space-y-5">
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                  <span>Question {adaptiveQIndex + 1} of {adaptiveQuestions.length}</span>
                  <span>Score: {Object.keys(adaptiveAnswers).length}/{adaptiveQuestions.length}</span>
                </div>
                {currentAdaptiveQ && (
                  <div className="rounded-2xl border border-border bg-surface/40 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.2em] text-primary mb-2">
                          {currentAdaptiveQ.roadmapName} · {currentAdaptiveQ.skill}
                        </div>
                        <h3 className="text-sm font-semibold">
                          {adaptiveQIndex + 1}. {currentAdaptiveQ.question}
                        </h3>
                      </div>
                      <span className="text-[10px] rounded-full bg-primary/10 text-primary px-2 py-1">
                        {currentAdaptiveQ.type}
                      </span>
                    </div>
                    <div className="mt-4 grid gap-2">
                      {currentAdaptiveQ.options.map((option, optionIndex) => {
                        const selected = adaptiveAnswers[currentAdaptiveQ.id] === optionIndex;
                        return (
                          <button
                            key={optionIndex}
                            onClick={() =>
                              setAdaptiveAnswers((prev) => ({
                                ...prev,
                                [currentAdaptiveQ.id]: optionIndex,
                              }))
                            }
                            className={`rounded-xl border px-3 py-2 text-left text-sm transition ${
                              selected
                                ? "border-green-500 bg-green-500/15 text-foreground"
                                : "border-border text-muted-foreground hover:bg-surface-elevated"
                            }`}
                          >
                            {option.text}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => setAdaptiveQIndex((i) => Math.max(0, i - 1))}
                    disabled={adaptiveQIndex === 0}
                    className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm hover:bg-surface-elevated transition disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setAdaptiveQIndex((i) => Math.min(adaptiveQuestions.length - 1, i + 1))}
                    disabled={adaptiveQIndex >= adaptiveQuestions.length - 1}
                    className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm hover:bg-surface-elevated transition disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={submitAdaptive}
                    disabled={
                      adaptiveSubmitting ||
                      Object.keys(adaptiveAnswers).length !== adaptiveQuestions.length
                    }
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-5 py-2.5 text-sm text-primary-foreground disabled:opacity-50"
                  >
                    {adaptiveSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ArrowRight className="h-4 w-4" />
                    )}
                    Submit adaptive assessment
                  </button>
                </div>
              </div>
            )}

            {adaptiveResult?.error && (
              <p className="mt-5 text-sm text-red-300">
                {adaptiveResult.error}
              </p>
            )}
            {adaptiveResult?.accuracy !== undefined && (
              <div className="mt-5 rounded-2xl border border-green-500/30 bg-green-500/10 p-4 text-sm">
                Score: {adaptiveResult.correctAnswers}/
                {adaptiveResult.totalQuestions} · {adaptiveResult.accuracy}%
                accuracy · {adaptiveResult.speedScore} speed score
              </div>
            )}
          </section>
        )}

        {activeTab === "core" && (
          <section className="card-glow rounded-3xl p-6">
            {coreLoading && (
              <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin mr-2" /> Loading core
                test...
              </div>
            )}

            {!coreLoading && coreResult?.error && (
              <p className="text-sm text-red-300 py-8 text-center">
                {coreResult.error}
              </p>
            )}

            {!coreLoading && !coreQuestions.length && !coreResult && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {CORE_TRACKS.map((track) => (
                  <button
                    key={track.key}
                    onClick={() => loadCoreTrack(track.key)}
                    disabled={coreLoading}
                    className="card-glow rounded-2xl p-5 group text-left"
                  >
                    <div
                      className={`inline-flex h-10 w-10 rounded-xl bg-gradient-to-br ${track.color} grid place-items-center mb-3`}
                    >
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-base font-semibold">{track.label}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {track.desc}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-2">
                      5 questions · ~3 min
                    </p>
                  </button>
                ))}
              </div>
            )}

            {!coreLoading && coreQuestions.length > 0 && !coreResult && (
              <>
                <div className="flex items-center justify-between gap-4 mb-5">
                  <div>
                    <h2 className="text-xl font-display font-bold">
                      {CORE_TRACKS.find((t) => t.key === coreTrack)?.label ||
                        coreTrack}{" "}
                      Assessment
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Question {coreIndex + 1} of {coreQuestions.length}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                      {formatTime(coreTimerState)}
                    </span>
                    <span className="text-sm font-medium">
                      Score: {coreScore}/{coreQuestions.length}
                    </span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-surface-elevated overflow-hidden mb-6">
                  <div
                    className="h-full bg-gradient-brand transition-all duration-500"
                    style={{ width: `${coreProgress}%` }}
                  />
                </div>

                {currentCoreQ && (
                  <div className="rounded-2xl border border-primary/70 bg-surface/40 p-6">
                    <h2 className="text-2xl font-display font-semibold leading-snug">
                      {currentCoreQ.question}
                    </h2>
                    <div className="mt-6 grid gap-3">
                      {currentCoreQ.options.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleCoreAnswer(idx)}
                          className="text-left p-4 rounded-xl border border-border bg-surface/60 hover:border-primary hover:bg-surface-elevated transition group"
                        >
                          <div className="flex items-center gap-3">
                            <span className="h-7 w-7 rounded-md border border-border grid place-items-center text-xs text-muted-foreground group-hover:border-primary group-hover:text-primary shrink-0">
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span className="text-sm">{opt.text}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {coreQuestions.length > 0 && coreIndex >= coreQuestions.length && (
                  <div className="mt-6 flex justify-end">
                    <button
                      onClick={submitCore}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-5 py-2.5 text-sm text-primary-foreground"
                    >
                      Submit {coreTrack} assessment
                    </button>
                  </div>
                )}
              </>
            )}

            {!coreLoading && coreResult && !coreResult.error && (
              <div className="text-center py-10">
                <h3 className="text-xl font-display font-bold mb-2">
                  {CORE_TRACKS.find((t) => t.key === coreTrack)?.label ||
                    coreTrack}{" "}
                  Complete
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Score: {coreResult.correctAnswers || coreScore}/
                  {coreResult.totalQuestions || coreQuestions.length} ·{" "}
                  {coreResult.accuracy ||
                    Math.round((coreScore / coreQuestions.length) * 100)}
                  % correct
                </p>
                <button
                  onClick={() => {
                    setCoreQuestions([]);
                    setCoreIndex(0);
                    setCoreScore(0);
                    setCoreResult(null);
                    setCoreTimer(0);
                    setCoreTrack(null);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-gradient-brand text-primary-foreground text-sm font-medium"
                >
                  Take another track
                </button>
              </div>
            )}
          </section>
        )}

        {activeTab === "coding" && (
          <section className="card-glow rounded-3xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-display font-bold">
                  Coding challenge
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Write a JavaScript solve function and run it against sample
                  test cases. SkillSnap tracks time, attempts, and errors.
                </p>
              </div>
              <button
                onClick={loadCoding}
                disabled={codingLoading || codingSubmitting}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-4 py-2.5 text-sm text-primary-foreground disabled:opacity-60"
              >
                {codingLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RotateCcw className="h-4 w-4" />
                )}
                {codingLoading ? "Loading..." : "Load challenge"}
              </button>
            </div>

            {!coding && !codingLoading && (
              <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                Load a coding challenge to start.
              </div>
            )}

            {codingLoading && (
              <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin mr-2" /> Loading coding
                challenge...
              </div>
            )}

            {coding && (
              <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
                <div className="space-y-4">
                  <div className="rounded-2xl border border-border bg-surface/40 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-semibold">{coding.title}</h3>
                      <span className="text-xs rounded-full bg-primary/10 text-primary px-2 py-1">
                        {coding.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-3">
                      {coding.prompt}
                    </p>
                    <div className="mt-4">
                      <label className="text-xs text-muted-foreground mb-2 block">
                        Language
                      </label>
                      <select
                        value={codingLanguage}
                        onChange={(e) => {
                          const nextLanguage = e.target.value;
                          setCodingLanguage(nextLanguage);
                          setCodingCode(starterForLanguage(coding, nextLanguage));
                          setCodingOutput("");
                          setCodingTestResults([]);
                          setCodingResult(null);
                        }}
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                      >
                        {CODING_LANGUAGES.map((language) => (
                          <option key={language.key} value={language.key}>
                            {language.label}{language.runnable ? " - browser run" : " - manual output"}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mt-4">
                      <div className="text-xs text-muted-foreground mb-2">
                        Function signature
                      </div>
                      <pre className="overflow-auto rounded-xl bg-background p-4 text-xs text-foreground">
                        solve({coding.inputLabel || "input"})
                      </pre>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="text-xs text-muted-foreground">
                        Constraints
                      </div>
                      {coding.constraints.map((constraint, i) => (
                        <div
                          key={i}
                          className="text-xs text-muted-foreground"
                        >
                          · {constraint}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3">
                    <div className="rounded-2xl border border-border bg-surface/50 p-4">
                      <div className="text-xs text-muted-foreground">Time</div>
                      <div className="text-2xl font-display font-bold">
                        {formatTime(codingTimer)}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-border bg-surface/50 p-4">
                      <div className="text-xs text-muted-foreground">
                        Attempts
                      </div>
                      <div className="text-2xl font-display font-bold">
                        {codingAttempts}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-border bg-surface/50 p-4">
                      <div className="text-xs text-muted-foreground">Errors</div>
                      <div className="text-2xl font-display font-bold">
                        {codingErrors}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Your code</label>
                    <textarea
                      value={codingCode}
                      onChange={(e) => setCodingCode(e.target.value)}
                      className="mt-2 min-h-56 w-full rounded-2xl border border-border bg-background p-4 font-mono text-xs outline-none focus:border-primary"
                      placeholder="Paste or write your solution here"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      {canRunCodingInBrowser ? "Console" : "Output"}
                    </label>
                    <textarea
                      value={codingOutput}
                      onChange={(e) => setCodingOutput(e.target.value)}
                      readOnly={canRunCodingInBrowser}
                      className="mt-2 min-h-28 w-full rounded-2xl border border-border bg-background p-4 font-mono text-xs outline-none focus:border-primary"
                      placeholder={canRunCodingInBrowser ? "Run tests to see results." : "Run your code locally and paste the output here."}
                    />
                  </div>
                  {canRunCodingInBrowser && (
                  <div className="rounded-2xl border border-border bg-surface/40 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-primary mb-3">
                      Test cases
                    </div>
                    <div className="space-y-2">
                      {(coding.testCases || []).map((testCase, index) => {
                        const result = codingTestResults.find((item) => item.index === index);
                        return (
                          <div
                            key={index}
                            className={`rounded-xl border p-3 text-xs ${
                              result
                                ? result.passed
                                  ? "border-green-500/40 bg-green-500/10"
                                  : "border-red-500/40 bg-red-500/10"
                                : "border-border bg-background/50"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <span className="font-medium">Case {index + 1}</span>
                              {result && (
                                <span className={result.passed ? "text-green-300" : "text-red-300"}>
                                  {result.passed ? "Passed" : "Failed"}
                                </span>
                              )}
                            </div>
                            <div className="mt-2 grid gap-1 text-muted-foreground">
                              <span>Input: {stableStringify(testCase.input)}</span>
                              <span>Expected: {stableStringify(testCase.expected)}</span>
                              {result && <span>Actual: {stableStringify(result.actual)}</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  )}
                  <div className="flex flex-wrap justify-end gap-3">
                    {canRunCodingInBrowser && (
                    <button
                      type="button"
                      onClick={runCodingTests}
                      className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm hover:bg-surface-elevated transition"
                    >
                      Run tests
                    </button>
                    )}
                    <button
                      onClick={submitCoding}
                      disabled={codingSubmitting || (canRunCodingInBrowser ? !codingTestResults.length : !codingOutput.trim())}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-5 py-2.5 text-sm text-primary-foreground disabled:opacity-50"
                    >
                      {codingSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                      Submit output
                    </button>
                  </div>
                  {codingResult?.error && (
                    <p className="text-sm text-red-300">
                      {codingResult.error}
                    </p>
                  )}
                  {codingResult?.correct !== undefined && (
                    <div
                      className={`rounded-2xl p-4 text-sm ${
                        codingResult.correct
                          ? "border border-green-500/30 bg-green-500/10"
                          : "border border-yellow-500/30 bg-yellow-500/10"
                      }`}
                    >
                      <div className="font-semibold">{codingResult.message}</div>
                      {!codingResult.correct && (
                        <div className="mt-3">
                          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                            Expected output
                          </div>
                          <pre className="whitespace-pre-wrap text-xs rounded-lg bg-background/60 p-3 border border-border">
                            {coding?.expectedOutput || "Same as challenge"}
                          </pre>
                          <div className="text-[10px] text-muted-foreground mt-2">
                            Your output:
                          </div>
                          <pre className="whitespace-pre-wrap text-xs rounded-lg bg-background/60 p-3 border border-border">
                            {codingOutput}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
