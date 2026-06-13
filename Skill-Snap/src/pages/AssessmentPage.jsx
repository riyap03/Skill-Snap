import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../config/api";
import { ArrowRight, Code2, FlaskConical, Loader2, Play, RotateCcw, Sparkles, Zap } from "lucide-react";

const CORE_TRACKS = [
  { key: "frontend", label: "Frontend Development", color: "from-blue-500 to-cyan-400", desc: "React, CSS, JS, HTML, state management" },
  { key: "backend", label: "Backend Development", color: "from-emerald-500 to-teal-400", desc: "Node.js, Express, databases, APIs" },
  { key: "dsa", label: "Data Structures & Algorithms", color: "from-orange-500 to-yellow-400", desc: "Arrays, trees, graphs, algorithms" },
  { key: "ai_ml", label: "AI & Machine Learning", color: "from-purple-500 to-pink-400", desc: "ML basics, neural networks, data preprocessing" },
];

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export default function AssessmentPage() {
  const [activeTab, setActiveTab] = useState("adaptive");
  const [adaptive, setAdaptive] = useState(null);
  const [adaptiveQuestions, setAdaptiveQuestions] = useState([]);
  const [adaptiveAnswers, setAdaptiveAnswers] = useState({});
  const [adaptiveLoading, setAdaptiveLoading] = useState(false);
  const [adaptiveSubmitting, setAdaptiveSubmitting] = useState(false);
  const [adaptiveResult, setAdaptiveResult] = useState(null);
  const [adaptiveTimer, setAdaptiveTimer] = useState(0);

  const [coding, setCoding] = useState(null);
  const [codingLoading, setCodingLoading] = useState(false);
  const [codingSubmitting, setCodingSubmitting] = useState(false);
  const [codingResult, setCodingResult] = useState(null);
  const [codingCode, setCodingCode] = useState("");
  const [codingOutput, setCodingOutput] = useState("");
  const [codingAttempts, setCodingAttempts] = useState(0);
  const [codingErrors, setCodingErrors] = useState(0);
  const [codingTimer, setCodingTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (adaptiveQuestions.length && !adaptiveResult) {
      interval = setInterval(() => setAdaptiveTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [adaptiveQuestions, adaptiveResult]);

  useEffect(() => {
    let interval;
    if (coding && !codingResult) {
      interval = setInterval(() => setCodingTimer((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [coding, codingResult]);

  const loadAdaptive = async () => {
    setAdaptiveLoading(true);
    setAdaptiveResult(null);
    setAdaptiveAnswers({});
    setAdaptiveTimer(0);
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
          timeTaken: adaptiveTimer,
          pendingSkills: adaptive?.pendingSkills || [],
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
    setCodingAttempts(0);
    setCodingErrors(0);
    setCodingTimer(0);
    try {
      const res = await axios.get(apiUrl("/api/assessment/coding-questions"), {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCoding(res.data.challenges?.[0] || null);
    } catch {
      setCodingResult({ error: "Failed to load coding challenge." });
    } finally {
      setCodingLoading(false);
    }
  };

  const submitCoding = async () => {
    if (!coding) return;
    setCodingSubmitting(true);
    const nextAttempts = codingAttempts + 1;
    const nextErrors = codingOutput.trim() === coding.expectedOutput?.trim() ? codingErrors : codingErrors + 1;
    try {
      const res = await axios.post(
        apiUrl("/api/assessment/coding/submit"),
        {
          challengeId: coding.id,
          code: codingCode,
          output: codingOutput,
          timeTaken: codingTimer,
          attempts: nextAttempts,
          errors: nextErrors,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setCodingAttempts(nextAttempts);
      setCodingErrors(nextErrors);
      setCodingResult(res.data);
    } catch {
      setCodingResult({ error: "Failed to submit coding challenge." });
    } finally {
      setCodingSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="text-center mb-10">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-brand grid place-items-center shadow-[0_0_30px_-4px_var(--brand-purple)]">
            <Zap className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="mt-5 text-3xl font-display font-bold tracking-tight">Adaptive Assessments</h1>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
            Take questions generated from your roadmap progress, then practice coding challenges that track speed, attempts, and errors.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-3 mb-8">
          <button onClick={() => setActiveTab("adaptive")} className={`card-glow rounded-2xl p-4 text-left ${activeTab === "adaptive" ? "border-brand-purple/70" : ""}`}>
            <Sparkles className="h-5 w-5 text-brand-pink mb-2" />
            <h3 className="font-semibold">Roadmap Progress</h3>
            <p className="text-xs text-muted-foreground mt-1">Questions adapt to pending roadmap skills.</p>
          </button>
          <button onClick={() => setActiveTab("coding")} className={`card-glow rounded-2xl p-4 text-left ${activeTab === "coding" ? "border-brand-purple/70" : ""}`}>
            <Code2 className="h-5 w-5 text-brand-pink mb-2" />
            <h3 className="font-semibold">Coding Challenge</h3>
            <p className="text-xs text-muted-foreground mt-1">Track output, speed, attempts, and errors.</p>
          </button>
          <Link to="/test" onClick={() => setActiveTab("core")} className="card-glow rounded-2xl p-4 text-left">
            <FlaskConical className="h-5 w-5 text-brand-pink mb-2" />
            <h3 className="font-semibold">Core Tracks</h3>
            <p className="text-xs text-muted-foreground mt-1">Frontend, backend, DSA, and AI/ML tests.</p>
          </Link>
        </div>

        {activeTab === "adaptive" && (
          <section className="card-glow rounded-3xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-display font-bold">Roadmap-based assessment</h2>
                <p className="text-sm text-muted-foreground mt-1">Generate questions from the skills you have not completed yet.</p>
              </div>
              <button onClick={loadAdaptive} disabled={adaptiveLoading || adaptiveSubmitting} className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-4 py-2.5 text-sm text-primary-foreground disabled:opacity-60">
                {adaptiveLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
                {adaptiveLoading ? "Generating..." : "Generate from roadmap"}
              </button>
            </div>

            {adaptive && (
              <div className="grid sm:grid-cols-3 gap-3 mb-6">
                <div className="rounded-2xl border border-border bg-surface/50 p-4">
                  <div className="text-xs text-muted-foreground">Pending skills</div>
                  <div className="text-2xl font-display font-bold">{adaptive.totalPending}</div>
                </div>
                <div className="rounded-2xl border border-border bg-surface/50 p-4">
                  <div className="text-xs text-muted-foreground">Time</div>
                  <div className="text-2xl font-display font-bold">{formatTime(adaptiveTimer)}</div>
                </div>
                <div className="rounded-2xl border border-border bg-surface/50 p-4">
                  <div className="text-xs text-muted-foreground">Level</div>
                  <div className="text-2xl font-display font-bold capitalize">{adaptive.level}</div>
                </div>
              </div>
            )}

            {!adaptiveQuestions.length && !adaptiveLoading && (
              <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                Generate an adaptive assessment to start.
              </div>
            )}

            {adaptiveLoading && (
              <div className="flex items-center justify-center py-10 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin mr-2" /> Generating questions...
              </div>
            )}

            {!!adaptiveQuestions.length && (
              <>
                <div className="space-y-5">
                  {adaptiveQuestions.map((question, index) => (
                    <div key={question.id} className="rounded-2xl border border-border bg-surface/40 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-[10px] uppercase tracking-[0.2em] text-brand-pink mb-2">
                            {question.roadmapName} · {question.skill}
                          </div>
                          <h3 className="text-sm font-semibold">{index + 1}. {question.question}</h3>
                        </div>
                        <span className="text-[10px] rounded-full bg-brand-purple/10 text-brand-pink px-2 py-1">{question.type}</span>
                      </div>
                      <div className="mt-4 grid gap-2">
                        {question.options.map((option, optionIndex) => (
                          <button
                            key={optionIndex}
                            onClick={() => setAdaptiveAnswers({ ...adaptiveAnswers, [question.id]: optionIndex })}
                            className={`rounded-xl border px-3 py-2 text-left text-sm transition ${
                              adaptiveAnswers[question.id] === optionIndex
                                ? "border-brand-purple bg-brand-purple/10 text-foreground"
                                : "border-border text-muted-foreground hover:bg-surface-elevated"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {adaptiveResult?.error && <p className="mt-5 text-sm text-red-300">{adaptiveResult.error}</p>}
                {adaptiveResult?.accuracy !== undefined && (
                  <div className="mt-5 rounded-2xl border border-green-500/30 bg-green-500/10 p-4 text-sm">
                    Score: {adaptiveResult.correctAnswers}/{adaptiveResult.totalQuestions} · {adaptiveResult.accuracy}% accuracy · {adaptiveResult.speedScore} speed score
                  </div>
                )}

                <div className="mt-6 flex justify-end">
                  <button onClick={submitAdaptive} disabled={adaptiveSubmitting || Object.keys(adaptiveAnswers).length !== adaptiveQuestions.length} className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-5 py-2.5 text-sm text-primary-foreground disabled:opacity-50">
                    {adaptiveSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                    Submit adaptive assessment
                  </button>
                </div>
              </>
            )}
          </section>
        )}

        {activeTab === "coding" && (
          <section className="card-glow rounded-3xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-display font-bold">Coding challenge</h2>
                <p className="text-sm text-muted-foreground mt-1">Submit the expected program output. SkillSnap tracks time, attempts, and errors.</p>
              </div>
              <button onClick={loadCoding} disabled={codingLoading || codingSubmitting} className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-4 py-2.5 text-sm text-primary-foreground disabled:opacity-60">
                {codingLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
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
                <Loader2 className="h-4 w-4 animate-spin mr-2" /> Loading coding challenge...
              </div>
            )}

            {coding && (
              <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
                <div className="space-y-4">
                  <div className="rounded-2xl border border-border bg-surface/40 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-semibold">{coding.title}</h3>
                      <span className="text-xs rounded-full bg-brand-purple/10 text-brand-pink px-2 py-1">{coding.difficulty}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-3">{coding.prompt}</p>
                    <div className="mt-4">
                      <div className="text-xs text-muted-foreground mb-2">Starter code</div>
                      <pre className="overflow-auto rounded-xl bg-background p-4 text-xs text-foreground">{coding.starterCode}</pre>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="text-xs text-muted-foreground">Constraints</div>
                      {coding.constraints.map((constraint, i) => (
                        <div key={i} className="text-xs text-muted-foreground">· {constraint}</div>
                      ))}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3">
                    <div className="rounded-2xl border border-border bg-surface/50 p-4">
                      <div className="text-xs text-muted-foreground">Time</div>
                      <div className="text-2xl font-display font-bold">{formatTime(codingTimer)}</div>
                    </div>
                    <div className="rounded-2xl border border-border bg-surface/50 p-4">
                      <div className="text-xs text-muted-foreground">Attempts</div>
                      <div className="text-2xl font-display font-bold">{codingAttempts}</div>
                    </div>
                    <div className="rounded-2xl border border-border bg-surface/50 p-4">
                      <div className="text-xs text-muted-foreground">Errors</div>
                      <div className="text-2xl font-display font-bold">{codingErrors}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Your code</label>
                    <textarea
                      value={codingCode}
                      onChange={(e) => setCodingCode(e.target.value)}
                      className="mt-2 min-h-56 w-full rounded-2xl border border-border bg-background p-4 font-mono text-xs outline-none focus:border-brand-purple"
                      placeholder="Paste or write your solution here"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Expected output from your code</label>
                    <textarea
                      value={codingOutput}
                      onChange={(e) => setCodingOutput(e.target.value)}
                      className="mt-2 min-h-28 w-full rounded-2xl border border-border bg-background p-4 font-mono text-xs outline-none focus:border-brand-purple"
                      placeholder="Example: 1&#10;2&#10;Fizz&#10;4&#10;Buzz"
                    />
                  </div>
                  <div className="flex flex-wrap justify-end gap-3">
                    <button onClick={submitCoding} disabled={codingSubmitting || !codingOutput.trim()} className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-5 py-2.5 text-sm text-primary-foreground disabled:opacity-50">
                      {codingSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                      Submit output
                    </button>
                  </div>
                  {codingResult?.error && <p className="text-sm text-red-300">{codingResult.error}</p>}
                  {codingResult?.correct !== undefined && (
                    <div className={`rounded-2xl p-4 text-sm ${codingResult.correct ? "border border-green-500/30 bg-green-500/10" : "border border-yellow-500/30 bg-yellow-500/10"}`}>
                      {codingResult.message}
                      {!codingResult.correct && codingResult.expectedOutput && <pre className="mt-2 whitespace-pre-wrap text-xs">{codingResult.expectedOutput}</pre>}
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        )}

        {activeTab !== "coding" && (
          <section className="mt-8 card-glow rounded-3xl p-6">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <h2 className="text-xl font-display font-bold">Core skill tracks</h2>
                <p className="text-sm text-muted-foreground mt-1">Use these for broader diagnostics across major domains.</p>
              </div>
              <Link to="/test" className="inline-flex items-center gap-1 text-sm text-brand-pink">Open test hub <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {CORE_TRACKS.map((track) => (
                <Link key={track.key} to={`/assessment/${track.key}`} className="card-glow rounded-2xl p-5 group">
                  <div className={`inline-flex h-10 w-10 rounded-xl bg-gradient-to-br ${track.color} grid place-items-center mb-3`}>
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-base font-semibold">{track.label}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{track.desc}</p>
                  <p className="text-[10px] text-muted-foreground mt-2">5 questions · ~3 min</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
