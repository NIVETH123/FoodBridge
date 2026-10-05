import React, { useState } from "react";
import "./Login.css";

function Login({ onHome, onRegister, onLogin }) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  
const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const response = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || "Invalid email or password");
      return;
    }

    alert("Login successful!");
    onLogin(email);
  } catch (error) {
    setError("Server connection failed. Please try again.");
  }
};

  return (
    <div className="login-page">

      <header className="login-header">
        <div className="logo-area">
          <div className="logo-icon">♡</div>

          <div>
            <h1>
              Food<span>Bridge</span>
            </h1>
            <p>Food Donation Management System</p>
          </div>
        </div>

        <div className="header-links">
          <span onClick={onHome} className="home-link">
           Home
          </span>
          <button>Register</button>
        </div>
      </header>

      <div className="login-box">

        <div className="login-icon">👤</div>

        <h2>
          Donor <span>Login</span>
        </h2>

        <p className="subtitle">
          Welcome back to Food Bridge
        </p>

       <form onSubmit={handleSubmit}>

          <input
  type="email"
  placeholder="✉   Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
/>

         <input
  type="password"
  placeholder="🔒   Password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  required
/>

{error && (
  <p className="error-message">{error}</p>
)}

          <button type="submit" className="login-button">
            Login
          </button>

       </form>

        <p className="register-text">
           Don't have an account?{" "}
          <span onClick={onRegister}>Register</span>
        </p>

      </div>

    </div>
  );
}

export default Login;