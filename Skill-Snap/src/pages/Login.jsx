import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const googleButtonRef = useRef(null);
  const navigate = useNavigate();

  const saveSession = useCallback((data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.userId);
    localStorage.setItem("name", data.name);
    navigate("/");
  }, [navigate]);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;

    const renderGoogleButton = () => {
      if (!window.google || !googleButtonRef.current) return;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response) => {
          try {
            setError("");
            setIsSubmitting(true);
            const res = await axios.post(`${API_URL}/google`, {
              credential: response.credential,
            });
            saveSession(res.data);
          } catch (err) {
            setError(err.response?.data?.message || "Google sign-in failed");
          } finally {
            setIsSubmitting(false);
          }
        },
      });

      googleButtonRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        width: 336,
        text: isSignup ? "signup_with" : "signin_with",
      });
    };

    if (window.google) {
      renderGoogleButton();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = renderGoogleButton;
    document.body.appendChild(script);
  }, [isSignup, saveSession]);

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

      const url = isSignup ? `${API_URL}/register` : `${API_URL}/login`;
      const payload = {
        email: formData.email.trim(),
        password: formData.password,
      };

      if (isSignup) {
        payload.name = formData.name.trim();
      }

      const res = await axios.post(url, payload);
      saveSession(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">
          {isSignup ? "Create account" : "Welcome back"}
        </h1>
        <p className="auth-subtitle">
          {isSignup
            ? "Create an account to start your journey"
            : "Your journey is waiting"}
        </p>

        {GOOGLE_CLIENT_ID ? (
          <div className="auth-google-wrap" ref={googleButtonRef} />
        ) : (
          <button type="button" className="auth-btn auth-btn-google" disabled>
            Google sign-in needs setup
          </button>
        )}

        <div className="auth-divider">or continue with email</div>

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <input
              type="text"
              name="name"
              placeholder="Your name"
              className="auth-input"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email address"
            className="auth-input"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="auth-input"
            value={formData.password}
            onChange={handleChange}
            autoComplete={isSignup ? "new-password" : "current-password"}
            required
          />

          {error && <p className="auth-error">{error}</p>}

          <button
            type="submit"
            className="auth-btn auth-btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Please wait..." : isSignup ? "Create account" : "Sign in"}
          </button>
        </form>

        <p className="auth-toggle">
          {isSignup ? "Already have an account?" : "New to SkillSnap?"}{" "}
          <button
            type="button"
            onClick={() => {
              setError("");
              setIsSignup(!isSignup);
            }}
          >
            {isSignup ? "Sign in" : "Create one"}
          </button>
        </p>
      </div>
    </section>
  );
}
