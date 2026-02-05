import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };



const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const url = isSignup
      ? "http://localhost:5000/api/auth/register"
      : "http://localhost:5000/api/auth/login";

    const res = await axios.post(url, formData);

    // SAVE REAL DATA
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("userId", res.data.userId);
    localStorage.setItem("name", res.data.name);

    navigate("/");
  } catch (err) {
    alert(err.response?.data?.message || "Auth failed");
  }
};


  return (
    <section className="auth-container">
      <div className="auth-card">
        {/* Title */}
        <h1 className="auth-title">
          {isSignup ? 'Begin your story 🌱' : 'Welcome back 🌸'}
        </h1>
        <p className="auth-subtitle">
          {isSignup
            ? 'Create an account to start your journey'
            : 'Your journey is waiting'}
        </p>

        {/* Google Auth */}
        <button type="button" className="auth-btn auth-btn-google">
          Continue with Google
        </button>

        <div className="auth-divider">or continue with email</div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {isSignup && (
            <input
              type="text"
              name="name"
              placeholder="Your name"
              className="auth-input"
              value={formData.name}
              onChange={handleChange}
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
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="auth-input"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="auth-btn auth-btn-primary">
            {isSignup ? 'Create account' : 'Sign in'}
          </button>
        </form>

        {/* Toggle */}
        <p className="auth-toggle">
          {isSignup ? 'Already have an account?' : 'New to SkillSnap?'}{' '}
          <button type="button" onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? 'Sign in' : 'Create one'}
          </button>
        </p>
      </div>
    </section>
  );
}
