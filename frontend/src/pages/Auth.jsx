import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("signup");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* =========================
     LOGIN FUNCTION
     ========================= */
  const loginUser = async (email, password) => {
    const res = await fetch("http://127.0.0.1:8000/api/token/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: email,
        password: password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error("Login failed");
    }

    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);

    navigate("/checkout");
  };

  /* =========================
     SIGNUP + AUTO LOGIN
     ========================= */
  const handleSignup = async () => {
    setError("");

    const res = await fetch("http://127.0.0.1:8000/api/auth/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(
        data?.email?.[0] ||
        data?.password?.[0] ||
        "Signup failed"
      );
      return;
    }

    // ✅ Redirect to login mode after successful signup
    setMode("login");
    setError("Account created. Please log in.");

  };

  /* =========================
     NORMAL LOGIN
     ========================= */
  const handleLogin = async () => {
    setError("");
    try {
      await loginUser(form.email, form.password);
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>{mode === "signup" ? "Create Account" : "Login"}</h2>

        {error && <p className="error">{error}</p>}

        {mode === "signup" && (
          <>
            <input
              name="first_name"
              placeholder="First name"
              onChange={handleChange}
            />
            <input
              name="last_name"
              placeholder="Last name"
              onChange={handleChange}
            />
          </>
        )}

        <input
          name="email"
          placeholder="Email"
          type="email"
          onChange={handleChange}
        />

        <input
          name="password"
          placeholder="Password"
          type="password"
          onChange={handleChange}
        />

        <button
          className="primary"
          onClick={mode === "signup" ? handleSignup : handleLogin}
        >
          {mode === "signup" ? "Sign up & Continue" : "Login"}
        </button>

        <p className="switch">
          {mode === "signup" ? (
            <>
              Already have an account?{" "}
              <span onClick={() => setMode("login")}>Login</span>
            </>
          ) : (
            <>
              New user?{" "}
              <span onClick={() => setMode("signup")}>Create account</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
