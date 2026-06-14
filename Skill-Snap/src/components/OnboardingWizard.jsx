import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../config/api";
import { ChevronRight, ChevronLeft, Sparkles, User, Target, Code, GraduationCap, Clock, BookOpen } from "lucide-react";

const STEPS = [
  { key: "currentRole", label: "Current Role", icon: User, question: "What is your current role?" },
  { key: "targetRole", label: "Target Role", icon: Target, question: "What role do you want to land?" },
  { key: "knownSkills", label: "Known Skills", icon: Code, question: "What skills do you already know?" },
  { key: "experienceLevel", label: "Experience", icon: GraduationCap, question: "How would you rate your experience?" },
  { key: "weeklyStudyHours", label: "Study Hours", icon: Clock, question: "How many hours can you study per week?" },
  { key: "learningStyle", label: "Learning Style", icon: BookOpen, question: "How do you learn best?" },
];

export default function OnboardingWizard() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState({
    currentRole: "",
    targetRole: "",
    knownSkills: [],
    experienceLevel: "",
    weeklyStudyHours: 10,
    learningStyle: "",
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(apiUrl("/api/onboarding/status"), {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.onboardingCompleted) {
          navigate("/dashboard");
        }
      } catch {
      // onboarding status check failed - continue to onboarding
    }
    };
    checkStatus();
  }, [navigate]);

  const SKILL_SUGGESTIONS = [
    "JavaScript", "TypeScript", "React", "Next.js", "Vue.js", "Angular",
    "Node.js", "Express", "Python", "Django", "Flask", "Java", "Spring Boot",
    "C++", "C#", "Go", "Rust", "Ruby", "PHP", "Swift", "Kotlin",
    "MongoDB", "PostgreSQL", "MySQL", "Redis", "Firebase",
    "HTML", "CSS", "Tailwind CSS", "SASS", "Bootstrap",
    "Git", "Docker", "AWS", "Azure", "GCP",
    "TensorFlow", "PyTorch", "Pandas", "NumPy",
    "Linux", "Shell Scripting", "CI/CD", "Kubernetes", "Figma",
  ];

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addSkill = (skill) => {
    const trimmed = skill.trim();
    if (trimmed && !form.knownSkills.includes(trimmed)) {
      updateForm("knownSkills", [...form.knownSkills, trimmed]);
    }
  };

  const removeSkill = (skill) => {
    updateForm("knownSkills", form.knownSkills.filter((s) => s !== skill));
  };

  const nextStep = () => {
    const stepKey = STEPS[currentStep].key;
    if (stepKey === "knownSkills" && form.knownSkills.length === 0) {
      alert("Add at least one skill you know");
      return;
    }
    if (stepKey === "weeklyStudyHours") {
      updateForm("weeklyStudyHours", form.weeklyStudyHours);
    }
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  const submitOnboarding = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        apiUrl("/api/onboarding/save"),
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSaved(true);
      setTimeout(() => navigate("/assessment"), 800);
    } catch {
      alert("Failed to save onboarding. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (saved) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-brand grid place-items-center">
            <Sparkles className="h-6 w-6 text-primary-foreground" />
          </div>
          <h2 className="mt-4 text-2xl font-display font-bold">Profile saved!</h2>
          <p className="text-sm text-muted-foreground mt-1">Redirecting to assessment…</p>
        </div>
      </div>
    );
  }

  const current = STEPS[currentStep];
  const progressPct = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-2xl px-6 py-12">
        <div className="animate-fade-up">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-gradient-brand grid place-items-center">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold">Let's personalize SkillSnap for you</h1>
              <p className="text-xs text-muted-foreground">This takes ~2 minutes</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-10">
            <div className="h-1.5 rounded-full bg-surface-elevated overflow-hidden">
              <div className="h-full bg-gradient-brand transition-all duration-500" style={{ width: `${progressPct}%` }} />
            </div>
            <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
              {STEPS.map((s, i) => (
                <span key={s.key} className={i <= currentStep ? "text-primary" : ""}>{s.label}</span>
              ))}
            </div>
          </div>

          <div className="card-glow rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <current.icon className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-display font-semibold">{current.question}</h2>
            </div>

            {/* Step: Current Role */}
            {current.key === "currentRole" && (
              <div className="grid sm:grid-cols-2 gap-3">
                {["Student", "Fresher", "Junior Developer", "Mid Developer", "Senior Developer", "Designer", "Other"].map((role) => (
                  <button
                    key={role}
                    onClick={() => updateForm("currentRole", role)}
                    className={`p-4 rounded-xl border text-left text-sm transition ${
                      form.currentRole === role ? "border-primary bg-surface-elevated" : "border-border hover:border-primary"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            )}

            {/* Step: Target Role */}
            {current.key === "targetRole" && (
              <div className="grid sm:grid-cols-2 gap-3">
                {["Frontend Developer", "Backend Developer", "Fullstack Developer", "AI/ML Engineer", "Data Scientist", "DevOps Engineer", "Software Engineer", "Other"].map((role) => (
                  <button
                    key={role}
                    onClick={() => updateForm("targetRole", role)}
                    className={`p-4 rounded-xl border text-left text-sm transition ${
                      form.targetRole === role ? "border-primary bg-surface-elevated" : "border-border hover:border-primary"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            )}

            {/* Step: Known Skills */}
            {current.key === "knownSkills" && (
              <div>
                <p className="text-xs text-muted-foreground mb-3">Select all skills you're comfortable with.</p>
                <div className="flex flex-wrap gap-2">
                  {SKILL_SUGGESTIONS.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => form.knownSkills.includes(skill) ? removeSkill(skill) : addSkill(skill)}
                      className={`px-3 py-1.5 rounded-full text-xs border transition ${
                        form.knownSkills.includes(skill)
                          ? "border-primary bg-primary/20 text-primary"
                          : "border-border hover:border-primary"
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
                {form.knownSkills.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-2">Selected ({form.knownSkills.length}):</p>
                    <div className="flex flex-wrap gap-2">
                      {form.knownSkills.map((s) => (
                        <span key={s} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-elevated border border-border text-xs">
                          {s}
                          <button onClick={() => removeSkill(s)} className="text-muted-foreground hover:text-red-400">×</button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step: Experience Level */}
            {current.key === "experienceLevel" && (
              <div className="grid gap-3">
                {["Beginner", "Intermediate", "Advanced"].map((level) => (
                  <button
                    key={level}
                    onClick={() => updateForm("experienceLevel", level.toLowerCase())}
                    className={`p-5 rounded-xl border text-left transition ${
                      form.experienceLevel === level.toLowerCase() ? "border-primary bg-surface-elevated" : "border-border hover:border-primary"
                    }`}
                  >
                    <div className="text-sm font-medium">{level}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {level === "Beginner" ? "Learning fundamentals, building simple projects" : level === "Intermediate" ? "Comfortable with core concepts, building complex apps" : "Deep expertise, system design, mentoring"}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Step: Weekly Study Hours */}
            {current.key === "weeklyStudyHours" && (
              <div>
                <div className="text-center mb-4">
                  <span className="text-3xl font-display font-bold">{form.weeklyStudyHours}</span>
                  <span className="text-sm text-muted-foreground ml-2">hours per week</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="40"
                  step="1"
                  value={form.weeklyStudyHours}
                  onChange={(e) => updateForm("weeklyStudyHours", parseInt(e.target.value || 10))}
                  className="w-full accent-brand-purple"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  <span>5 hrs</span><span>20 hrs</span><span>40 hrs</span>
                </div>
              </div>
            )}

            {/* Step: Learning Style */}
            {current.key === "learningStyle" && (
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { key: "visual", label: "Visual", desc: "Diagrams, videos, infographics" },
                  { key: "auditory", label: "Auditory", desc: "Lectures, podcasts, discussions" },
                  { key: "hands-on", label: "Hands-on", desc: "Building projects, practice exercises" },
                  { key: "theoretical", label: "Theoretical", desc: "Reading documentation, deep reading" },
                ].map((style) => (
                  <button
                    key={style.key}
                    onClick={() => updateForm("learningStyle", style.key)}
                    className={`p-4 rounded-xl border text-left text-sm transition ${
                      form.learningStyle === style.key ? "border-primary bg-surface-elevated" : "border-border hover:border-primary"
                    }`}
                  >
                    <div className="font-medium">{style.label}</div>
                    <div className="text-xs text-muted-foreground mt-1">{style.desc}</div>
                  </button>
                ))}
              </div>
            )}

            {/* Navigation */}
            <div className="mt-8 flex justify-between">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="px-4 py-2 rounded-md border border-border text-sm hover:bg-surface-elevated disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4 inline mr-1" /> Back
              </button>
              {currentStep < STEPS.length - 1 ? (
                <button
                  onClick={nextStep}
                  className="inline-flex items-center gap-1 px-5 py-2 rounded-md bg-gradient-brand text-primary-foreground text-sm font-medium"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={submitOnboarding}
                  disabled={loading}
                  className="inline-flex items-center gap-1 px-5 py-2 rounded-md bg-gradient-brand text-primary-foreground text-sm font-medium disabled:opacity-60"
                >
                  {loading ? "Saving…" : "Finish onboarding"} <Sparkles className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
