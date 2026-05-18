import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../config/api";

import { Clock, CheckCircle2, ArrowRight, Sparkles, Zap } from "lucide-react";

const questions = [
  "Find the maximum element in an array",
  "Reverse an array",
  "Check if array is sorted",
  "Find duplicate element",
  "Rotate array by K steps",
];

const total = questions.length;

export default function Test() {
  const [started, setStarted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [score, setScore] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const progress = ((questionIndex + (finished ? 1 : 0)) / total) * 100;
  const pct = Math.round((score / total) * 100);
  const level = pct >= 80 ? "Advanced" : pct >= 50 ? "Intermediate" : "Beginner";

  const startTest = () => {
    setStarted(true);
    setStartTime(Date.now());
  };

  const answerQuestion = (correct) => {
    if (correct) setScore((prev) => prev + 1);

    if (questionIndex < total - 1) {
      setQuestionIndex((prev) => prev + 1);
    } else {
      setFinished(true);
    }
  };

  const finishTest = async () => {
    const endTime = Date.now();
    const timeTaken = Math.floor((endTime - startTime) / 1000);
    const token = localStorage.getItem("token");

    setSubmitting(true);
    try {
      await axios.post(
        apiUrl("/api/progress"),
        {
          topic: "Arrays",
          score,
          totalQuestions: total,
          timeTaken,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
     
      <main className="mx-auto max-w-3xl px-6 py-12">

        {/* START SCREEN */}
        {!started && (
          <div className="animate-fade-up">
            <div className="card-glow rounded-3xl p-10 text-center relative overflow-hidden">
              <div
                className="absolute -top-20 -right-20 h-60 w-60 rounded-full opacity-25"
                style={{ background: "var(--gradient-brand)", filter: "blur(80px)" }}
              />
              <div className="relative">
                <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-brand grid place-items-center shadow-[0_0_30px_-4px_var(--brand-purple)]">
                  <Sparkles className="h-6 w-6 text-primary-foreground" />
                </div>
                <h2 className="mt-5 text-3xl font-display font-bold tracking-tight">
                  SkillSnap Diagnostic Test
                </h2>
                <p className="mt-2 text-muted-foreground">
                  A quick {total}-question test helps us tune every roadmap to your exact level.
                </p>
                <div className="mt-6 grid sm:grid-cols-3 gap-3 text-left">
                  {["Arrays", "Problem Solving", "~5 minutes"].map((item, i) => (
                    <div key={i} className="rounded-xl p-4 bg-surface/60 border border-border text-sm text-muted-foreground text-center">
                      {item}
                    </div>
                  ))}
                </div>
                <button
                  onClick={startTest}
                  className="mt-8 inline-flex items-center gap-2 px-6 py-2.5 rounded-md bg-gradient-brand text-primary-foreground text-sm font-medium"
                >
                  Start Test <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* QUESTION SCREEN */}
        {started && !finished && (
          <div className="animate-fade-up">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Question {questionIndex + 1} of {total}</span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> Arrays
              </span>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-surface-elevated overflow-hidden">
              <div
                className="h-full bg-gradient-brand transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div key={questionIndex} className="mt-10 card-glow rounded-3xl p-8 animate-fade-up">
              <div className="text-xs uppercase tracking-[0.2em] text-brand-pink">Aptitude · Arrays</div>
              <h2 className="mt-3 text-2xl sm:text-3xl font-display font-semibold leading-snug">
                {questions[questionIndex]}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Have you solved this type of problem before?
              </p>
              <div className="mt-6 grid sm:grid-cols-2 gap-3">
                <button
                  onClick={() => answerQuestion(true)}
                  className="text-left p-4 rounded-xl border border-border bg-surface/60 hover:border-brand-purple hover:bg-surface-elevated transition group"
                >
                  <div className="flex items-center gap-3">
                    <span className="h-6 w-6 rounded-md border border-border grid place-items-center text-xs text-muted-foreground group-hover:border-brand-purple group-hover:text-brand-pink">
                      A
                    </span>
                    <span className="text-sm">Yes, I solved this</span>
                  </div>
                </button>
                <button
                  onClick={() => answerQuestion(false)}
                  className="text-left p-4 rounded-xl border border-border bg-surface/60 hover:border-brand-purple hover:bg-surface-elevated transition group"
                >
                  <div className="flex items-center gap-3">
                    <span className="h-6 w-6 rounded-md border border-border grid place-items-center text-xs text-muted-foreground group-hover:border-brand-purple group-hover:text-brand-pink">
                      B
                    </span>
                    <span className="text-sm">No, I couldn't solve it</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setFinished(true)}
                className="px-4 py-2 rounded-md border border-border text-sm hover:bg-surface-elevated"
              >
                Submit assessment
              </button>
            </div>
          </div>
        )}

        {/* RESULTS SCREEN */}
        {finished && (
          <div className="animate-fade-up">
            <div className="card-glow rounded-3xl p-10 text-center relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{ background: "var(--gradient-brand)", filter: "blur(120px)" }}
              />
              <div className="relative">
                <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-brand grid place-items-center shadow-[0_0_30px_-4px_var(--brand-purple)]">
                  <CheckCircle2 className="h-6 w-6 text-primary-foreground" />
                </div>
                <h2 className="mt-5 text-3xl font-display font-bold tracking-tight">
                  Assessment complete
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Here's where you stand today — and where to go next.
                </p>

                <div className="mt-8 grid sm:grid-cols-3 gap-4 text-left">
                  <div className="rounded-2xl p-5 bg-surface/60 border border-border">
                    <div className="text-xs text-muted-foreground">Skill Level</div>
                    <div className="mt-1 text-2xl font-display font-bold text-gradient">{level}</div>
                  </div>
                  <div className="rounded-2xl p-5 bg-surface/60 border border-border">
                    <div className="text-xs text-muted-foreground">Score</div>
                    <div className="mt-1 text-2xl font-display font-bold">{score} / {total}</div>
                  </div>
                  <div className="rounded-2xl p-5 bg-surface/60 border border-border">
                    <div className="text-xs text-muted-foreground">Topic</div>
                    <div className="mt-1 text-base font-semibold">Arrays</div>
                  </div>
                </div>

                <div className="mt-4 grid sm:grid-cols-2 gap-4 text-left">
                  <div className="rounded-2xl p-5 bg-surface/60 border border-border">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Zap className="h-4 w-4 text-brand-pink" /> Strengths
                    </div>
                    <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                      <li>· Problem identification</li>
                      <li>· Array traversal patterns</li>
                    </ul>
                  </div>
                  <div className="rounded-2xl p-5 bg-surface/60 border border-border">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <Sparkles className="h-4 w-4 text-brand-pink" /> Focus areas
                    </div>
                    <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                      <li>· In-place rotation</li>
                      <li>· Duplicate detection</li>
                    </ul>
                  </div>
                </div>

                {/* SUBMIT / DONE */}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  {!submitted ? (
                    <button
                      onClick={finishTest}
                      disabled={submitting}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-gradient-brand text-primary-foreground text-sm font-medium disabled:opacity-60"
                    >
                      {submitting ? "Submitting…" : "Submit Result"}
                    </button>
                  ) : (
                    <Link
                      to="/roadmap"
                      className="inline-flex items-center gap-1 px-5 py-2.5 rounded-md bg-gradient-brand text-primary-foreground text-sm font-medium"
                    >
                      See my roadmap <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                  {submitted && (
                    <p className="text-xs text-muted-foreground">
                      SkillSnap learned your pace ✓
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}