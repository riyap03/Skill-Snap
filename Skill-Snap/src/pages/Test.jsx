import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../config/api";
import {
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  X,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

const TRACK_ORDER = ["frontend", "backend", "dsa", "ai_ml"];

export default function Test() {
  const [phase, setPhase] = useState("select");
  const [questions, setQuestions] = useState([]);
  const [track, setTrack] = useState(null);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [duration, setDuration] = useState(0);
  const [result, setResult] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (phase === "test") {
      timerRef.current = setInterval(() => {
        setDuration((d) => d + 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [phase]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const loadQuestions = async (trackKey) => {
    try {
      setSubmitting(true);
      const res = await axios.get(apiUrl(`/api/assessment/questions?track=${trackKey}`));
      setQuestions(res.data.questions || []);
      setTrack(res.data.track);
      setQIndex(0);
      setAnswers([]);
      setScore(0);
      setDuration(0);
      setResult(null);
      setSubmitted(false);
      setPhase("test");
} catch {
       alert("Failed to load questions. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAnswer = (choiceIndex) => {
    const q = questions[qIndex];
    if (!q) return;
    const isCorrect = q.options[choiceIndex]?.correct;
    const newAnswers = [...answers, choiceIndex];
    const newScore = isCorrect ? score + 1 : score;
    setAnswers(newAnswers);
    setScore(newScore);

    if (qIndex < questions.length - 1) {
      setQIndex((i) => i + 1);
    } else {
      setPhase("result");
    }
  };

  const submitResult = async () => {
    const endTime = Date.now();
    const timeTaken = Math.floor((endTime - startTime) / 1000);
    const token = localStorage.getItem("token");
    setSubmitting(true);
    try {
      const res = await axios.post(
        apiUrl("/api/assessment/submit"),
        {
          track,
          correctAnswers: score,
          totalQuestions: questions.length,
          timeTaken: Math.max(timeTaken, duration),
          answers,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setResult(res.data);
      setSubmitted(true);
} catch {
       alert("Failed to submit assessment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const startTest = () => {
    setStartTime(Date.now());
  };

  const currentQ = questions[qIndex];
  const progressPct = questions.length ? Math.round(((qIndex + (phase === "result" ? 1 : 0)) / questions.length) * 100) : 0;
  const pct = questions.length ? Math.round((score / questions.length) * 100) : 0;
  const level = pct >= 80 ? "Advanced" : pct >= 50 ? "Intermediate" : "Beginner";

  if (phase === "select") {
    return (
      <div className="min-h-screen">
        <main className="mx-auto max-w-4xl px-6 py-12">
          <div className="text-center mb-10">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-brand grid place-items-center shadow-sm mx-auto">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="mt-5 text-3xl font-display font-bold tracking-tight">
              Skill Diagnostic Assessment
            </h1>
            <p className="mt-2 text-muted-foreground max-w-lg mx-auto">
              Choose a track to assess your current level. Each test has 5 multiple-choice questions covering core concepts.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {TRACK_ORDER.map((tk) => (
              <button
                key={tk}
                onClick={() => setTrack(tk)}
                disabled={submitting}
                className={`card-glow rounded-2xl p-6 text-left transition-all hover:border-primary/60 disabled:opacity-50`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-primary mb-1.5">
                      {tk === "fe" || tk === "frontend" ? "Frontend" : tk === "be" || tk === "backend" ? "Backend" : tk === "dsa" || tk === "dsa" ? "DSA" : "AI / ML"}
                    </div>
                    <h3 className="text-lg font-semibold">
                      {tk === "frontend" ? "Frontend Development" : tk === "backend" ? "Backend Development" : tk === "dsa" ? "Data Structures & Algorithms" : "AI & Machine Learning"}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1.5">
                      {tk === "frontend" ? "React, CSS, JS, HTML, state management" : tk === "backend" ? "Node.js, Express, databases, APIs" : tk === "dsa" ? "Arrays, trees, graphs, algorithms" : "ML basics, neural networks, data preprocessing"}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>5 questions · ~3 min</span>
                </div>
              </button>
            ))}
          </div>

          {track && (
            <div className="mt-8 text-center">
              <button
                onClick={() => { startTest(); loadQuestions(track); }}
                disabled={submitting}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-brand text-primary-foreground text-sm font-medium shadow-sm disabled:opacity-60"
              >
                {submitting ? "Loading..." : "Start Assessment"} <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </main>
      </div>
    );
  }

  if (phase === "test") {
    return (
      <div className="min-h-screen">
        <main className="mx-auto max-w-3xl px-6 py-10">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            <span>Question {qIndex + 1} of {questions.length}</span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> {formatTime(duration)}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-surface-elevated overflow-hidden mb-8">
            <div
              className="h-full bg-gradient-brand transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {currentQ && (
            <div key={qIndex} className="card-glow rounded-3xl p-8">
              <div className="text-xs uppercase tracking-[0.2em] text-primary">{track}</div>
              <h2 className="mt-3 text-2xl sm:text-3xl font-display font-semibold leading-snug">
                {currentQ.question}
              </h2>
              <div className="mt-6 grid gap-3">
                {currentQ.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    className="text-left p-4 rounded-xl border border-gray-200 bg-surface/60 hover:border-primary hover:bg-surface-elevated transition group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="h-7 w-7 rounded-md border border-gray-200 grid place-items-center text-xs text-muted-foreground group-hover:border-primary group-hover:text-primary shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-sm">{opt.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setPhase("result")}
              className="px-4 py-2 rounded-md border border-gray-200 text-sm hover:bg-surface-elevated"
            >
              Submit assessment
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="card-glow rounded-3xl p-10 text-center relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
          />
          <div className="relative">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-brand grid place-items-center shadow-sm">
              <CheckCircle2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <h2 className="mt-5 text-3xl font-display font-bold tracking-tight">
              {track ? `${track.replace(/_/g, " ")} Assessment Complete` : "Assessment complete"}
            </h2>
            <p className="mt-2 text-muted-foreground">You scored {score}/{questions.length} — {level} level</p>

            <div className="mt-8 grid sm:grid-cols-3 gap-4 text-left">
              <div className="rounded-2xl p-5 bg-surface/60 border border-gray-200">
                <div className="text-xs text-muted-foreground">Score</div>
                <div className="mt-1 text-2xl font-display font-bold">
                  {score} / {questions.length}
                </div>
                <div className="text-xs text-primary mt-1">{pct}% correct</div>
              </div>
              <div className="rounded-2xl p-5 bg-surface/60 border border-gray-200">
                <div className="text-xs text-muted-foreground">Skill Level</div>
                <div className="mt-1 text-2xl font-display font-bold text-gradient">{level}</div>
                <div className="text-xs text-muted-foreground mt-1">Based on accuracy</div>
              </div>
              <div className="rounded-2xl p-5 bg-surface/60 border border-gray-200">
                <div className="text-xs text-muted-foreground">Time taken</div>
                <div className="mt-1 text-2xl font-display font-bold">{formatTime(duration)}</div>
                <div className="text-xs text-muted-foreground mt-1">{questions.length} questions</div>
              </div>
            </div>

            {result && (
              <div className="mt-6 grid sm:grid-cols-2 gap-4 text-left">
                <div className="rounded-2xl p-5 bg-surface/60 border border-gray-200">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Zap className="h-4 w-4 text-primary" /> Strong areas
                  </div>
                  <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                    {(result.strongTopics?.length > 0 ? result.strongTopics : ["Good pacing", "Overall understanding"]).map((t, i) => (
                      <li key={i}>· {t}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl p-5 bg-surface/60 border border-gray-200">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Sparkles className="h-4 w-4 text-primary" /> Focus areas
                  </div>
                  <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                    {(result.weakTopics?.length > 0 ? result.weakTopics : ["Practice more", "Review fundamentals"]).map((t, i) => (
                      <li key={i}>· {t}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {!submitted ? (
                <button
                  onClick={submitResult}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-gradient-brand text-primary-foreground text-sm font-medium disabled:opacity-60"
                >
                  {submitting ? "Submitting..." : "Submit Result"}
                </button>
              ) : (
                <>
                  <Link
                    to="/roadmap"
                    className="inline-flex items-center gap-1 px-5 py-2.5 rounded-md bg-gradient-brand text-primary-foreground text-sm font-medium"
                  >
                    See my roadmap <ArrowRight className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => setPhase("select")}
                    className="px-4 py-2.5 rounded-md border border-gray-200 text-sm hover:bg-surface-elevated"
                  >
                    Take another track
                  </button>
                </>
              )}
            </div>
            {submitted && (
              <p className="text-xs text-muted-foreground mt-2">
                SkillSnap personalized your roadmap ✓
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
