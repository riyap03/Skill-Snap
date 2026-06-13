import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Plus,
  ExternalLink,
  Calendar,
  Sparkles,
  Download,
  Github,
  Palette,
  Trash2,
} from "lucide-react";
import { apiUrl } from "../config/api";
import jsPDF from "jspdf";
import MinimalPortfolio from "../components/themes/MinimalTheme";
import ModernPortfolio from "../components/themes/ModernTheme";
import ProfessionalPortfolio from "../components/themes/ProfessionalTheme";
import StartupPortfolio from "../components/themes/StartupTheme";
import TerminalPortfolio from "../components/themes/TerminalTheme";

const THEME_OPTIONS = [
  { key: "modern", label: "Modern", Component: ModernPortfolio },
  { key: "minimal", label: "Minimal", Component: MinimalPortfolio },
  { key: "professional", label: "Professional", Component: ProfessionalPortfolio },
  { key: "startup", label: "Startup", Component: StartupPortfolio },
  { key: "terminal", label: "Terminal", Component: TerminalPortfolio },
];

const THEME_MAP = Object.fromEntries(
  THEME_OPTIONS.map((theme) => [theme.key, theme])
);

const getApiErrorMessage = (err) =>
  err.response?.data?.message || err.message || "Something went wrong";

const formatDate = (date) => {
  if (!date) return "No date";
  const parsed = new Date(`${date}-01`);
  return Number.isNaN(parsed.getTime())
    ? "No date"
    : parsed.toLocaleDateString("en-US", { year: "numeric", month: "short" });
};

const getStoredTheme = () => {
  const stored = localStorage.getItem("portfolioTheme");
  return THEME_MAP[stored]?.key || "modern";
};

export default function Portfolio() {
  const [projects, setProjects] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    skills: "",
    date: "",
    link: "",
  });
  const [aiContent, setAiContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiMessage, setApiMessage] = useState("");
  const [selectedTheme, setSelectedTheme] = useState(getStoredTheme);

  const username = (localStorage.getItem("name") || "user").toLowerCase().replace(/\s+/g, "");
  const portfolioLink = `${window.location.origin}/portfolio/${username}?theme=${selectedTheme}`;
  const SelectedTheme = THEME_MAP[selectedTheme].Component;

  const previewPortfolio = {
    name: localStorage.getItem("name") || "Your Name",
    username,
    projects,
    aiContent,
    skills: [...new Set(projects.flatMap((project) => project.skills || []))],
  };

  const fetchPortfolio = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(apiUrl("/api/portfolio"), {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProjects(res.data.projects || []);
      setAiContent(res.data.aiContent || "");
      setApiMessage("");
    } catch (err) {
      setApiMessage(getApiErrorMessage(err));
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const exportPDF = async () => {
    try {
      if (!aiContent.trim()) {
        alert("Please generate the AI portfolio first.");
        return;
      }

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 16;
      const maxLineWidth = pageWidth - margin * 2;
      const lineHeight = 7;
      let y = margin;

      const name = localStorage.getItem("name") || "Your Name";
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(18);
      pdf.text(`${name} - AI Portfolio`, margin, y);
      y += 12;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);

      const lines = pdf.splitTextToSize(aiContent, maxLineWidth);

      lines.forEach((line) => {
        if (y > pageHeight - margin) {
          pdf.addPage();
          y = margin;
        }

        pdf.text(line, margin, y);
        y += lineHeight;
      });

      pdf.save(`${username}-ai-portfolio.pdf`);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const skills = newProject.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

      const res = await axios.post(
        apiUrl("/api/portfolio/project"),
        {
          title: newProject.title.trim(),
          description: newProject.description.trim(),
          skills,
          date: newProject.date,
          link: newProject.link.trim(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProjects(res.data.projects || []);
      setAiContent("");
      setApiMessage("Project added successfully");
      setNewProject({
        title: "",
        description: "",
        skills: "",
        date: "",
        link: "",
      });
      setShowAddForm(false);
    } catch (err) {
      const message = getApiErrorMessage(err);
      setApiMessage(message);
      alert(message);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!projectId || !window.confirm("Delete this project from your portfolio?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(apiUrl(`/api/portfolio/project/${projectId}`), {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProjects(res.data.projects || []);
      setAiContent("");
      setApiMessage("Project deleted successfully");
    } catch (err) {
      const message = getApiErrorMessage(err);
      setApiMessage(message);
      alert(message);
    }
  };

  const generatePortfolioAI = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        apiUrl("/api/portfolio/generate"),
        { projects },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAiContent(res.data.content || "");
      setApiMessage("AI portfolio generated successfully");
    } catch (err) {
      const message = getApiErrorMessage(err);
      setApiMessage(message);
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const handleThemeChange = (themeKey) => {
    setSelectedTheme(themeKey);
    localStorage.setItem("portfolioTheme", themeKey);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <section className="card-glow rounded-3xl p-5 sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Portfolio Builder
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Add projects, generate AI content, choose a theme, and preview your public portfolio.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <button
                onClick={exportPDF}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm hover:bg-surface-elevated"
              >
                <Download className="h-4 w-4" /> Export PDF
              </button>
              <Link
                to={portfolioLink}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm hover:bg-surface-elevated"
              >
                <ExternalLink className="h-4 w-4" /> Open public
              </Link>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(portfolioLink);
                  setApiMessage("Theme portfolio link copied!");
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm hover:bg-surface-elevated"
              >
                <ExternalLink className="h-4 w-4" /> Copy theme link
              </button>
              <button
                onClick={generatePortfolioAI}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-brand px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-[0_0_24px_-6px_var(--brand-purple)] hover:opacity-90 disabled:opacity-60 sm:col-span-2 lg:col-span-1"
              >
                <Sparkles className="h-4 w-4" />
                {loading ? "Generating..." : "Generate AI Portfolio"}
              </button>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-border bg-surface/40 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Palette className="h-4 w-4 text-brand-pink" />
              Portfolio theme
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
              {THEME_OPTIONS.map((theme) => (
                <button
                  key={theme.key}
                  onClick={() => handleThemeChange(theme.key)}
                  className={`rounded-xl border px-3 py-2 text-sm transition ${
                    selectedTheme === theme.key
                      ? "border-brand-purple bg-brand-purple/10 text-foreground"
                      : "border-border text-muted-foreground hover:bg-surface-elevated"
                  }`}
                >
                  {theme.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {apiMessage && (
          <div className="mt-4 rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-muted-foreground">
            {apiMessage}
          </div>
        )}

        <div className="mt-6 grid items-start gap-6 xl:grid-cols-[1fr_1.05fr]">
          <div className="space-y-6">
            <section className="card-glow rounded-3xl p-5 sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-semibold">Projects</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Project cards stay aligned and preview instantly in the selected theme.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-3 py-2 text-xs hover:bg-surface-elevated"
                >
                  <Plus className="h-3.5 w-3.5" /> {showAddForm ? "Close form" : "Add project"}
                </button>
              </div>

              {showAddForm && (
                <form onSubmit={handleAddProject} className="mt-5 rounded-2xl border border-border bg-surface/60 p-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-medium">Project Title</label>
                      <input
                        type="text"
                        className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand-purple"
                        value={newProject.title}
                        onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium">Date</label>
                      <input
                        type="month"
                        className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand-purple"
                        value={newProject.date}
                        onChange={(e) => setNewProject({ ...newProject, date: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="text-xs font-medium">Description</label>
                    <textarea
                      className="mt-1 w-full min-h-24 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand-purple"
                      rows={3}
                      value={newProject.description}
                      onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-medium">Skills</label>
                      <input
                        type="text"
                        placeholder="React, Node.js, MongoDB"
                        className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand-purple"
                        value={newProject.skills}
                        onChange={(e) => setNewProject({ ...newProject, skills: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium">Project Link</label>
                      <input
                        type="url"
                        placeholder="https://example.com"
                        className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-brand-purple"
                        value={newProject.link}
                        onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="rounded-lg border border-border px-3 py-2 text-xs hover:bg-surface-elevated"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg bg-gradient-brand px-3 py-2 text-xs font-medium text-primary-foreground"
                    >
                      Add Project
                    </button>
                  </div>
                </form>
              )}

              <div className="mt-5 grid gap-3">
                {projects.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                    No projects yet. Add your first project to build the portfolio.
                  </div>
                )}

                {projects.map((project) => (
                  <article
                    key={project._id || project.id || project.title}
                    className="rounded-2xl border border-border bg-surface/50 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-medium text-sm">{project.title}</h3>
                          <span className="rounded-full bg-brand-purple/10 px-2 py-0.5 text-[11px] text-brand-pink">
                            {formatDate(project.date)}
                          </span>
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {project.description}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {(project.skills || []).map((skill, idx) => (
                            <span
                              key={idx}
                              className="rounded-md border border-border bg-surface-elevated px-2 py-1 text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        {project.link ? (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-md p-2 text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        ) : (
                          <div className="rounded-md p-2 text-muted-foreground">
                            <Github className="h-4 w-4" />
                          </div>
                        )}
                        <button
                          onClick={() => handleDeleteProject(project._id)}
                          className="rounded-md p-2 text-destructive hover:bg-destructive/10"
                          title="Delete project"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {aiContent && (
              <section className="card-glow rounded-3xl p-5 sm:p-6">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-brand-pink">
                  <Sparkles className="h-4 w-4" /> AI Portfolio Summary
                </div>
                <pre className="whitespace-pre-wrap rounded-2xl border border-border bg-surface/50 p-4 text-xs leading-relaxed text-muted-foreground">
                  {aiContent}
                </pre>
              </section>
            )}
          </div>

          <aside className="xl:sticky xl:top-6">
            <section className="rounded-3xl border border-border bg-surface/40 p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-semibold">Live theme preview</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    This is the theme visitors will see on your public link.
                  </p>
                </div>
                <Link
                  to={portfolioLink}
                  className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-border px-3 py-2 text-xs hover:bg-surface-elevated"
                >
                  Open <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="overflow-hidden rounded-2xl border border-border bg-background">
                <SelectedTheme portfolio={previewPortfolio} username={username} preview />
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}
