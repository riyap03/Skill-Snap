import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiUrl } from "../config/api";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function Roadmap() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [selected, setSelected] = useState("");
  const [checked, setChecked] = useState({});
  const [skillOrder, setSkillOrder] = useState([]);
  const [plan, setPlan] = useState(null);
  const [stats, setStats] = useState(null);
  const [insight, setInsight] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showTestPopup, setShowTestPopup] = useState(false);

  const navigate = useNavigate();

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  // check test
  useEffect(() => {
    const checkTest = async () => {
      try {
        const res = await axios.get(
          apiUrl("/api/progress/check"),
          getAuthHeader()
        );

        if (!res.data.hasTakenTest) {
          setShowTestPopup(true);
        }
      } catch (err) {
        console.error(err);
      }
    };

    checkTest();
  }, []);

  useEffect(() => {
    const loadRoadmaps = async () => {
      try {
        const res = await axios.get(
          apiUrl("/api/roadmaps"),
          getAuthHeader()
        );

        setRoadmaps(res.data.roadmaps || []);
      } catch {
        setRoadmaps([]);
      }
    };

    loadRoadmaps();
  }, []);

  const slugify = (name) =>
    name.replace(/\s+/g, "-").replace(/\//g, "-").toLowerCase();

  const applyPlan = (roadmapPlan) => {
    setPlan(roadmapPlan);
    setChecked(roadmapPlan.skills || {});
    setSkillOrder(
      roadmapPlan.skillOrder || Object.keys(roadmapPlan.skills || {})
    );
  };

  // fetch adaptive roadmap data from backend
  useEffect(() => {
    if (!selected) {
      setChecked({});
      setSkillOrder([]);
      setPlan(null);
      setStats(null);
      setInsight(null);
      setProjects([]);
      setError("");
      return;
    }

    const slug = slugify(selected);
    setLoading(true);
    setError("");

    const loadRoadmap = async () => {
      try {
        const [roadmapRes, statsRes, insightRes, projectsRes] =
          await Promise.all([
            axios.get(
              apiUrl(`/api/roadmaps/${slug}`),
              getAuthHeader()
            ),
            axios.get(
              apiUrl(`/api/roadmaps/${slug}/stats?range=weekly`),
              getAuthHeader()
            ),
            axios.get(
              apiUrl(`/api/roadmaps/${slug}/insights`),
              getAuthHeader()
            ),
            axios.get(
              apiUrl("/api/roadmaps/projects/recommend"),
              getAuthHeader()
            ),
          ]);

        applyPlan(roadmapRes.data);
        setStats(statsRes.data);
        setInsight(insightRes.data.message);
        setProjects(projectsRes.data.projects || []);
      } catch {
        setChecked({});
        setSkillOrder([]);
        setPlan(null);
        setStats(null);
        setInsight(null);
        setProjects([]);
        setError("Roadmap could not be loaded. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadRoadmap();
  }, [selected]);

  // toggle skill
  const toggleSkill = async (skill) => {
    const newStatus = !checked[skill];
    const slug = slugify(selected);

    setChecked((prev) => ({ ...prev, [skill]: newStatus }));

    try {
      const res = await axios.patch(
        apiUrl(`/api/roadmaps/${slug}/skill`),
        { skillName: skill, status: newStatus },
        getAuthHeader()
      );

      if (res.data.skills) {
        applyPlan(res.data);
      }

      const [statsRes, insightRes, projectsRes] = await Promise.all([
        axios.get(
          apiUrl(`/api/roadmaps/${slug}/stats?range=weekly`),
          getAuthHeader()
        ),
        axios.get(
          apiUrl(`/api/roadmaps/${slug}/insights`),
          getAuthHeader()
        ),
        axios.get(
          apiUrl("/api/roadmaps/projects/recommend"),
          getAuthHeader()
        ),
      ]);

      setStats(statsRes.data);
      setInsight(insightRes.data.message);
      setProjects(projectsRes.data.projects || []);
    } catch {
      setChecked((prev) => ({ ...prev, [skill]: !newStatus }));
    }
  };

  // export PDF
  const exportPDF = async () => {
    if (!selected) return;

    const slug = slugify(selected);

    try {
      const res = await axios.get(
        apiUrl(`/api/roadmaps/${slug}/export`),
        { ...getAuthHeader(), responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `${slug}-roadmap.pdf`;
      link.click();
    } catch (err) {
      console.error(err);
    }
  };

  const total = plan?.total ?? (selected ? Object.keys(checked).length : 0);
  const completed =
    plan?.completed ?? Object.values(checked).filter(Boolean).length;
  const progress =
    plan?.progress ?? (total ? Math.round((completed / total) * 100) : 0);

  const chartData = stats
    ? Object.entries(stats).map(([date, value]) => ({
        date,
        value,
      }))
    : [];

  return (
    <>
      {showTestPopup && (
        <div className="test-popup">
          <div className="popup-card">
            <h3>Before starting roadmap...</h3>
            <p>SkillSnap needs to understand your level.</p>
            <button onClick={() => navigate("/test")}>
              Take Test
            </button>
            <button onClick={() => setShowTestPopup(false)}>
              Skip
            </button>
          </div>
        </div>
      )}

      <section className="roadmap-wrap">
        <div className="roadmap-card">
          <h2 className="roadmap-title">Choose Your Roadmap</h2>

          <select
            className="rm-select"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            <option value="">Select roadmap</option>
            {roadmaps.map((roadmap) => (
              <option key={roadmap.roadmapName} value={roadmap.roadmapName}>
                {roadmap.title}
              </option>
            ))}
          </select>

          {/* SKILLS */}
          {loading && <p className="insight-area">Loading your roadmap...</p>}

          {error && <p className="insight-area">{error}</p>}

          {selected && plan && (
            <div className="insight-area">
              <p>
                Level: {plan.level} | Pace: {plan.pace?.pace || "new"} |
                Weekly target: {plan.weeklyTarget}
              </p>
              {plan.nextFocus?.length > 0 && (
                <p>Next focus: {plan.nextFocus.join(", ")}</p>
              )}
            </div>
          )}

          {selected && !loading && (
            <div className="skills-grid">
              {skillOrder.map((skill) => (
                <label key={skill} className="skill-pill">
                  <input
                    type="checkbox"
                    checked={!!checked[skill]}
                    onChange={() => toggleSkill(skill)}
                  />
                  <span className="pill-face">{skill}</span>
                </label>
              ))}
            </div>
          )}

          {/* PROGRESS */}
          {selected && (
            <div className="progress-area">
              <h3>Progress: {progress}%</h3>
              <p>
                {completed} / {total} completed
              </p>
            </div>
          )}

          {/* STATS CHART */}
          {chartData.length > 0 && (
            <div className="stats-area">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#7c3aed"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* INSIGHT */}
          {insight && (
            <div className="insight-area">
              <p>{insight}</p>
            </div>
          )}

          {projects.length > 0 && (
            <div className="insight-area">
              <p>Recommended projects: {projects.join(", ")}</p>
            </div>
          )}
        </div>
      </section>

      <div className="rm-actions">
        <button
          onClick={exportPDF}
          disabled={!selected}
          className="btn btn-secondary"
        >
          Export PDF
        </button>
      </div>
    </>
  );
}
