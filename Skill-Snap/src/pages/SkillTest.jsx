import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../config/api";
import { ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export default function SkillTest() {
  const [phase, setPhase] = useState("loading");
  const [questions, setQuestions] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timer, setTimer] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    let interval;
    if (phase === "test") {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    const loadTest = async () => {
      try {
        const res = await axios.get(apiUrl("/api/assessment/skill-test"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.alreadyTaken && res.data.result) {
          setResult(res.data.result);
          setPhase("done");
          return;
        }
        setQuestions(res.data.questions || []);
        setPhase("test");
      } catch {
        setError("Failed to load skill test.");
        setPhase("error");
      }
    };

    loadTest();
  }, []);

  const handleAnswer = (choiceIndex) => {
    const q = questions[qIndex];
    if (!q) return;
    const isCorrect = q.options[choiceIndex]?.correct;
    const newAnswers = [...answers, choiceIndex];
    setAnswers(newAnswers);

    if (qIndex < questions.length - 1) {
      setQIndex((i) => i + 1);
    } else {
      setPhase("result");
    }
  };

  const submitResult = async () => {
    if (!token) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await axios.post(
        apiUrl("/api/assessment/skill-test/submit"),
        {
          answers,
          timeTaken: timer,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setResult(res.data);
      setPhase("done");
    } catch {
      setError("Failed to submit skill test.");
    } finally {
      setSubmitting(false);
    }
  };

  if (phase === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-brand-pink" />
        <p className="text-sm text-muted-foreground">Preparing your skill test...</p>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <AlertCircle className="h-10 w-10 text-red-400" />
        <p className="text-sm text-destructive">{error}</p>
        <Link to="/dashboard" className="text-sm text-brand-pink">Back to dashboard</Link>
      </div>
    );
  }

  if (phase === "done") {
    const data = result || {};
    return (
      <div className="min-h-screen">
        <main className="mx-auto max-w-3xl px-6 py-12">
          <div className="card-glow rounded-3xl p-10 text-center relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{ background: "var(--gradient-brand)", filter: "blur(120px)" }}
            />
            <div className="relative">
              <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-brand grid place-items-center shadow-[0_0_30px_-4px_var(--brand-purple)]">
                <CheckCircle2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <h2 className="mt-5 text-3xl font-display font-bold tracking-tight">Skill Test Complete</h2>
              <p className="mt-2 text-muted-foreground">Your baseline is set. Let's build your roadmap from here.</p>

              <div className="mt-8 grid sm:grid-cols-3 gap-4 text-left">
                <div className="rounded-2xl p-5 bg-surface/60 border border-border">
                  <div className="text-xs text-muted-foreground">Score</div>
                  <div className="mt-1 text-2xl font-display font-bold">
                    {data.correctAnswers || 0} / {data.totalQuestions || questions.length}
                  </div>
                  <div className="text-xs text-brand-pink mt-1">{data.accuracy || 0}% correct</div>
                </div>
                <div className="rounded-2xl p-5 bg-surface/60 border border-border">
                  <div className="text-xs text-muted-foreground">Time taken</div>
                  <div className="mt-1 text-2xl font-display font-bold">{formatTime(data.timeTaken || timer)}</div>
                  <div className="text-xs text-muted-foreground mt-1">{data.totalQuestions || questions.length} questions</div>
                </div>
                <div className="rounded-2xl p-5 bg-surface/60 border border-border">
                  <div className="text-xs text-muted-foreground">Level</div>
                  <div className="mt-1 text-2xl font-display font-bold text-gradient capitalize">{data.level || "beginner"}</div>
                  <div className="text-xs text-muted-foreground mt-1">Based on accuracy + speed</div>
                </div>
              </div>

              {(data.strongTopics?.length > 0 || data.weakTopics?.length > 0) && (
                <div className="mt-6 grid sm:grid-cols-2 gap-4 text-left">
                  <div className="rounded-2xl p-5 bg-surface/60 border border-border">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <CheckCircle2 className="h-4 w-4 text-green-400" /> Strong areas
                    </div>
                    <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                      {(data.strongTopics || ["General logic", "Basic concepts"]).map((t, i) => (
                        <li key={i}>· {t}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl p-5 bg-surface/60 border border-border">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <AlertCircle className="h-4 w-4 text-yellow-400" /> Focus areas
                    </div>
                    <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                      {(data.weakTopics || ["Practice more", "Review fundamentals"]).map((t, i) => (
                        <li key={i}>· {t}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link to="/roadmap" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-gradient-brand text-primary-foreground text-sm font-medium">
                  See my roadmap
                </Link>
                <Link to="/dashboard" className="px-4 py-2.5 rounded-md border border-border text-sm hover:bg-surface-elevated">
                  Back to dashboard
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (phase === "result") {
    const score = answers.reduce((acc, ans, i) => {
      const q = questions[i];
      return acc + (q?.options[ans]?.correct ? 1 : 0);
    }, 0);
    const total = questions.length;
    const pct = Math.round((score / total) * 100);
    const level = pct >= 80 ? "Advanced" : pct >= 50 ? "Intermediate" : "Beginner";

    return (
      <div className="min-h-screen">
        <main className="mx-auto max-w-3xl px-6 py-12">
          <div className="card-glow rounded-3xl p-10 text-center">
            <h2 className="text-3xl font-display font-bold tracking-tight">Skill Test Review</h2>
            <p className="mt-2 text-muted-foreground">You scored {score}/{total} — {level} level</p>

            <div className="mt-6">
              {questions.map((q, i) => {
                const chosen = answers[i];
                const correctOption = q.options.find((o) => o.correct);
                const isCorrect = chosen !== undefined && q.options[chosen]?.correct === true;
                return (
                  <div key={q.id} className="rounded-2xl border border-border bg-surface/40 p-5 mb-4 text-left">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-sm font-semibold">{i + 1}. {q.question}</h3>
                      <span className={`text-[10px] rounded-full px-2 py-1 ${isCorrect ? "bg-green-500/10 text-green-300" : "bg-red-500/10 text-red-300"}`}>
                        {isCorrect ? "Correct" : "Incorrect"}
                      </span>
                    </div>
                    <div className="mt-3 grid gap-2">
                      {q.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={`rounded-xl border px-3 py-2 text-sm ${
                            option.correct
                              ? "border-green-500/70 bg-green-500/10"
                              : optionIndex === chosen && !option.correct
                              ? "border-red-500/70 bg-red-500/10"
                              : "border-border text-muted-foreground"
                          }`}
                        >
                          {option.text}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={submitResult}
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-5 py-2.5 text-sm text-primary-foreground disabled:opacity-60"
            >
              {submitting ? "Saving..." : "Save results & continue"}
            </button>
          </div>
        </main>
      </div>
    );
  }

  const currentQ = questions[qIndex];
  const progressPct = questions.length ? Math.round(((qIndex + 1) / questions.length) * 100) : 0;

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => navigate("/dashboard")} className="p-2 rounded-xl border border-border hover:bg-surface-elevated">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <span className="text-sm text-muted-foreground">Question {qIndex + 1} of {questions.length}</span>
          </div>
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            {formatTime(timer)}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-surface-elevated overflow-hidden mb-8">
          <div className="h-full bg-gradient-brand transition-all duration-500" style={{ width: `${progressPct}%` }} />
        </div>

        {currentQ && (
          <div key={currentQ.id} className="card-glow rounded-3xl p-8">
            <h2 className="text-2xl font-display font-semibold leading-snug">
              {currentQ.question}
            </h2>
            <div className="mt-6 grid gap-3">
              {currentQ.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className="text-left p-4 rounded-xl border border-border bg-surface/60 hover:border-brand-purple hover:bg-surface-elevated transition group"
                >
                  <div className="flex items-center gap-3">
                    <span className="h-7 w-7 rounded-md border border-border grid place-items-center text-xs text-muted-foreground group-hover:border-brand-purple group-hover:text-brand-pink shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-sm">{opt.text}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
