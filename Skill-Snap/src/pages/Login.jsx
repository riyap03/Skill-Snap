import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import axios from "axios";
import { apiUrl } from "../config/api";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <div className="h-8 w-8 rounded-lg bg-gradient-brand grid place-items-center shadow-sm">
        <Sparkles className="h-4 w-4 text-primary-foreground" />
      </div>
      <span className="font-display text-lg font-semibold tracking-tight">
        Skill<span className="text-gradient">Snap</span>
      </span>
    </Link>
  );
}

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const saveSession = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.userId);
    localStorage.setItem("name", data.name);
    navigate("/dashboard");
  };

  const handleChange = (e) => {
    setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const email = formData.email.trim();

    if (isSignup && !formData.name.trim()) {
      return "Name is required";
    }

    if (!emailRegex.test(email)) {
      return "Enter a valid email address";
    }

    if (formData.password.length < 6) {
      return "Password must be at least 6 characters";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationMessage = validateForm();
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const url = isSignup ? apiUrl("/api/auth/register") : apiUrl("/api/auth/login");
      const payload = {
        email: formData.email.trim(),
        password: formData.password.trim(),
      };

      if (isSignup) {
        payload.name = formData.name.trim();
      }

      const res = await axios.post(url, payload);
      saveSession(res.data);
    } catch (err) {
      console.error("Authentication failed", err.response?.status, err.response?.data);
      setError(err.response?.data?.message || "Authentication failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden">
        <div
          className="absolute -top-40 -left-20 h-[500px] w-[500px] rounded-full opacity-50"
        />
        <div
          className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full opacity-30"
        />
        <div className="relative">
          <Logo />
        </div>

        <div className="relative max-w-md">
          <Sparkles className="h-6 w-6 text-primary mb-6" />
          <h2 className="font-display text-4xl font-bold leading-tight">
            {isSignup ? (
              <>
                "The journey of a thousand miles begins with a <span className="text-gradient">single step</span>."
              </>
            ) : (
              <>
                "Every expert was once a <span className="text-gradient">beginner</span> with a roadmap and a little patience."
              </>
            )}
          </h2>
          <p className="mt-6 text-muted-foreground">
            {isSignup ? "Start building your future today." : "Welcome back, builder. Your future self is already proud."}
          </p>
        </div>
        <div className="relative text-xs text-muted-foreground">© SkillSnap — Build smarter</div>
      </div>

      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Logo />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            {isSignup ? "Create account" : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isSignup ? "Create an account to start your journey." : "Sign in to continue your journey."}
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            {isSignup && (
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Your name"
                  className="w-full h-11 px-3 rounded-xl bg-surface/60 border border-gray-200 outline-none focus:border-primary text-sm transition-colors"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                className="w-full h-11 px-3 rounded-xl bg-surface/60 border border-gray-200 outline-none focus:border-primary text-sm transition-colors"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                {!isSignup && (
                  <button type="button" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    Forgot?
                  </button>
                )}
              </div>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                className="w-full h-11 px-3 rounded-xl bg-surface/60 border border-gray-200 outline-none focus:border-primary text-sm transition-colors"
                value={formData.password}
                onChange={handleChange}
                autoComplete={isSignup ? "new-password" : "current-password"}
                required
              />
            </div>

            {error && <p className="text-xs font-medium text-destructive/90 bg-destructive/10 p-3 rounded-lg border border-destructive/20">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 inline-flex items-center justify-center gap-1 rounded-xl mt-2 bg-gradient-brand text-primary-foreground shadow-sm hover:opacity-90 disabled:opacity-50 text-sm font-medium transition-all"
            >
              {isSubmitting ? "Please wait..." : isSignup ? "Create account" : "Sign in"}
              {!isSubmitting && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isSignup ? "Already have an account?" : "New to SkillSnap?"}{" "}
            <button
              type="button"
              className="text-foreground hover:text-primary font-medium underline underline-offset-4 transition-colors"
              onClick={() => {
                setError("");
                setIsSignup(!isSignup);
              }}
            >
              {isSignup ? "Sign in" : "Create one"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
