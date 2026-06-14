import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../config/api";
import { Sparkles, ArrowRight, CheckCircle2, Clock, ExternalLink, Trash2, X } from "lucide-react";

const PROJECT_OVERVIEWS = {
  "Netflix Clone": {
    goal: "Build a responsive streaming-style UI with catalog browsing, search, and detail screens.",
    skills: ["React", "CSS", "API integration", "Responsive UI"],
    steps: [
      "Plan the screens: home, browse, search, and details.",
      "Create reusable cards, navbar, hero, and loading states.",
      "Fetch mock movie data from an API or local JSON.",
      "Add search/filter logic and a detail route.",
      "Polish responsiveness and add empty/loading states.",
    ],
    deliverables: ["Working React app", "Responsive project cards", "Search/filter feature", "Live demo link"],
  },
  "Trello Board": {
    goal: "Build a kanban board where users can create, move, and manage tasks across columns.",
    skills: ["React", "State management", "Drag and drop", "Local persistence"],
    steps: [
      "Define columns like Todo, In Progress, and Done.",
      "Create task cards with title, description, and priority.",
      "Add add/edit/delete task actions.",
      "Implement drag-and-drop or move buttons between columns.",
      "Persist tasks in localStorage or connect a backend API.",
    ],
    deliverables: ["Kanban board UI", "Task CRUD actions", "Column movement", "Persisted tasks"],
  },
  "Auth API System": {
    goal: "Build a secure backend authentication API with register, login, logout, and protected routes.",
    skills: ["Node.js", "Express", "JWT", "Password hashing"],
    steps: [
      "Set up Express server and database models.",
      "Hash passwords before storing them.",
      "Create register and login endpoints.",
      "Issue and verify JWT tokens.",
      "Protect routes with authentication middleware.",
    ],
    deliverables: ["REST API", "JWT auth flow", "Protected route", "API documentation"],
  },
  "Blog Backend": {
    goal: "Build a blog API with posts, comments, users, and CRUD operations.",
    skills: ["Node.js", "Express", "MongoDB", "REST APIs"],
    steps: [
      "Design user, post, and comment models.",
      "Create CRUD endpoints for posts and comments.",
      "Add authentication for creating and editing posts.",
      "Validate request data and handle errors cleanly.",
      "Test endpoints with Postman or Thunder Client.",
    ],
    deliverables: ["Blog API", "CRUD endpoints", "Auth middleware", "Tested API routes"],
  },
  "Notes App with DB": {
    goal: "Build a notes app that stores, updates, deletes, and retrieves notes from a database.",
    skills: ["MongoDB", "Express", "CRUD", "API design"],
    steps: [
      "Create a note schema with title, body, tags, and timestamps.",
      "Build create, read, update, and delete endpoints.",
      "Add search or filter by tags.",
      "Validate required fields and handle missing notes.",
      "Connect a simple frontend or document API usage.",
    ],
    deliverables: ["Notes API", "Database models", "Tag filtering", "Clean error responses"],
  },
  "Quiz App": {
    goal: "Build an interactive quiz with questions, scoring, timer, and result summary.",
    skills: ["JavaScript", "React", "State management", "UX"],
    steps: [
      "Create a question bank with options and correct answers.",
      "Render one question at a time with progress tracking.",
      "Track selected answers and calculate score.",
      "Add a timer and result screen.",
      "Allow retaking the quiz with shuffled questions.",
    ],
    deliverables: ["Quiz flow", "Score calculation", "Timer", "Result summary"],
  },
  "Weather App": {
    goal: "Build a weather app that searches locations and displays current conditions.",
    skills: ["JavaScript", "API integration", "Async/await", "Responsive UI"],
    steps: [
      "Choose a weather API and get an API key.",
      "Build a search form for city names.",
      "Fetch and display temperature, humidity, wind, and conditions.",
      "Handle loading, empty, and error states.",
      "Make the UI responsive for mobile and desktop.",
    ],
    deliverables: ["Weather search", "API data display", "Error handling", "Responsive layout"],
  },
};

const getProjectTitle = (project) => (typeof project === "string" ? project : project.title);
const normalizeTitle = (title = "") => title.trim().toLowerCase();

const getProjectOverview = (project) => {
  const title = getProjectTitle(project);
  const overview = PROJECT_OVERVIEWS[title];

  if (overview) return { ...overview, title };

  return {
    title,
    goal: "Break this project into small milestones, build the core feature first, then polish the UI and documentation.",
    skills: project?.skills?.length ? project.skills : ["Planning", "Development", "Testing", "Deployment"],
    steps: [
      "Write a one-line problem statement for the project.",
      "List the minimum features needed for version 1.",
      "Build the core feature without styling first.",
      "Add UI, validation, and empty/error states.",
      "Test the flow manually and prepare a short README or demo.",
    ],
    deliverables: ["Working prototype", "Clean project structure", "Demo or documentation", "Reflection on learnings"],
  };
};

export default function ProjectsPage() {
  const [recommended, setRecommended] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [activeTab, setActiveTab] = useState("recommended");
  const [loading, setLoading] = useState(true);
  const [overviewProject, setOverviewProject] = useState(null);

  const loadProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { headers: { Authorization: `Bearer ${token}` } };
      const [recResult, portfolioResult] = await Promise.allSettled([
        axios.get(apiUrl("/api/roadmaps/projects/recommend"), headers),
        axios.get(apiUrl("/api/portfolio"), headers),
      ]);

      const completedProjects =
        portfolioResult.status === "fulfilled"
          ? (portfolioResult.value.data.projects || []).map((project) => ({
              _id: project._id,
              title: project.title,
              description: project.description,
              skills: project.skills || [],
              link: project.link,
            }))
          : [];
      const completedTitles = new Set(
        completedProjects.map((project) => normalizeTitle(project.title))
      );
      const rawRecommended =
        recResult.status === "fulfilled" ? recResult.value.data.projects || [] : [];

      setCompleted(completedProjects);
      setRecommended(
        rawRecommended.filter((project) => !completedTitles.has(normalizeTitle(getProjectTitle(project))))
      );
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const deleteCompletedProject = async (projectId) => {
    if (!projectId || !window.confirm("Delete this project from your portfolio?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(apiUrl(`/api/portfolio/project/${projectId}`), {
        headers: { Authorization: `Bearer ${token}` },
      });
      await loadProjects();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete project");
    }
  };

  const overview = overviewProject ? getProjectOverview(overviewProject) : null;

  const tabs = [
    { key: "recommended", label: "Recommended", icon: Sparkles },
    { key: "inprogress", label: "In Progress", icon: Clock },
    { key: "completed", label: "Completed", icon: CheckCircle2 },
  ];

  const visibleProjects = activeTab === "recommended" ? recommended : activeTab === "completed" ? completed : [];

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Projects</h1>
            <p className="mt-1 text-sm text-muted-foreground">Build projects to strengthen your portfolio and skills.</p>
          </div>
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm hover:bg-surface-elevated"
          >
            Add portfolio project <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="flex gap-2 mt-6 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                activeTab === tab.key
                  ? "bg-gradient-brand text-primary-foreground"
                  : "border border-border hover:bg-surface-elevated"
              }`}
            >
              <tab.icon className="h-4 w-4 inline mr-1.5" /> {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading projects…</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {visibleProjects.map((project, i) => {
                const title = getProjectTitle(project);
                const skills = project.skills || [];
                const description = project.description || "Build this project to strengthen your portfolio.";

                return (
                  <div key={`${activeTab}-${i}-${title}`} className="card-glow rounded-2xl p-6 group">
                    <h3 className="text-base font-semibold">{title}</h3>
                    <p className="text-xs text-muted-foreground mt-2">{description}</p>
                    {skills.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {skills.map((skill, j) => (
                          <span key={j} className="text-[10px] px-2 py-0.5 rounded-md bg-surface-elevated border border-border text-muted-foreground">{skill}</span>
                        ))}
                      </div>
                    )}

                    {activeTab === "completed" ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-primary hover:opacity-80"
                          >
                            View project <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                        <button
                          onClick={() => deleteCompletedProject(project._id)}
                          className="inline-flex items-center gap-1 text-xs text-destructive hover:opacity-80"
                        >
                          Delete <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setOverviewProject(project)}
                        className="mt-4 inline-flex items-center gap-1 text-xs text-primary hover:opacity-80"
                      >
                        Start project <ArrowRight className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {recommended.length === 0 && !loading && activeTab === "recommended" && (
            <div className="text-center py-12">
              <Sparkles className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No recommendations left. Complete more skills or build recommended projects.</p>
            </div>
          )}

          {activeTab === "inprogress" && (
            <div className="text-center py-12">
              <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No projects in progress yet.</p>
              <p className="text-xs text-muted-foreground mt-1">Start a recommended project to create your plan.</p>
              <Link to="/roadmap" className="mt-3 inline-flex items-center gap-1 text-xs text-primary hover:opacity-80">
                Browse roadmaps <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          )}

          {activeTab === "completed" && completed.length === 0 && (
            <div className="text-center py-12">
              <CheckCircle2 className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No completed projects yet.</p>
              <p className="text-xs text-muted-foreground mt-1">Add a project from the Portfolio Builder to track it here.</p>
            </div>
          )}
        </div>
      </main>

      {overview && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-background/70 backdrop-blur-sm">
          <div className="card-glow rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary">Project overview</p>
                <h2 className="mt-2 text-2xl font-display font-bold">{overview.title}</h2>
              </div>
              <button
                onClick={() => setOverviewProject(null)}
                className="rounded-full p-2 hover:bg-surface-elevated"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{overview.goal}</p>

            <div className="mt-5">
              <h3 className="text-sm font-semibold mb-3">Skills you will practice</h3>
              <div className="flex flex-wrap gap-2">
                {overview.skills.map((skill, i) => (
                  <span key={i} className="rounded-md border border-border bg-surface-elevated px-2.5 py-1 text-xs">{skill}</span>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold mb-3">How to build it</h3>
              <ol className="space-y-3">
                {overview.steps.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-brand text-[11px] font-medium text-primary-foreground">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold mb-3">Final deliverables</h3>
              <ul className="grid sm:grid-cols-2 gap-2">
                {overview.deliverables.map((item, i) => (
                  <li key={i} className="rounded-xl border border-border bg-surface/50 px-3 py-2 text-xs text-muted-foreground">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button
                onClick={() => setOverviewProject(null)}
                className="rounded-xl border border-border px-4 py-2 text-sm hover:bg-surface-elevated"
              >
                Close
              </button>
              <Link
                to="/portfolio"
                onClick={() => setOverviewProject(null)}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                Add to portfolio <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
