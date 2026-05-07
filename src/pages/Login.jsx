import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../styles/auth.css";

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = React.useState("login");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    let result;

    if (mode === "signup") {
      result = await supabase.auth.signUp({
        email,
        password,
      });
    } else {
      result = await supabase.auth.signInWithPassword({
        email,
        password,
      });
    }

    setLoading(false);

    if (result.error) {
      setMessage(result.error.message);
      return;
    }

    if (mode === "signup") {
      setMessage("Account created. Check your email if Supabase asks for confirmation.");
      return;
    }

    navigate("/admin");
  }

  return (
    <div className="page authPage">
      <div className="card authCard">
        <h1>{mode === "login" ? "Login" : "Create Account"}</h1>
        <p>
          {mode === "login"
            ? "Login to access your account."
            : "Create an account for your store."}
        </p>

        <form onSubmit={handleSubmit} className="authForm">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />

          <button className="btn primary" disabled={loading}>
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Login"
              : "Sign Up"}
          </button>
        </form>

        {message && <p className="authMessage">{message}</p>}

        <button
          type="button"
          className="authSwitch"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
        >
          {mode === "login"
            ? "No account? Sign up"
            : "Already have account? Login"}
        </button>

        <Link to="/" className="authBack">
          ← Back home
        </Link>
      </div>
    </div>
  );
}