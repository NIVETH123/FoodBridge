import React, { useState } from "react";
import "./Register.css";

function Register( { onHome, onLogin } ){
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [location, setLocation] = useState("");

  
const handleSubmit = async (e) => {
  e.preventDefault();

  if (password !== confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  setError("");

  try {
    const response = await fetch("http://localhost:5000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        mobile,
        password,
        location,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    alert("Registration successful!");
    onLogin();
  } catch (error) {
    setError(error.message);
  }
};

  return (
    <div className="register-page">

      <header className="register-header">
        <div className="logo-area">
          <div className="logo-icon">♡</div>
          <div>
            <h1>Food<span>Bridge</span></h1>
            <p>Food Donation Management System</p>
          </div>
        </div>

        <div className="header-links">
          <span onClick={onHome}
          className="home-link">
            Home
          </span>
          <button onClick={onLogin}>Login</button>
        </div>
      </header>

      <div className="side-message left-message">
        <h2>
          Together<br />
          we can make<br />
          a difference
        </h2>

        <div className="heart">♡</div>

        <h3>
          Donate Food<br />
          Spread Happiness
        </h3>

        <img
          src="/food-basket.png"
          className="food-basket-image"
          alt="Food Donation"
/>
      
      </div>

      <div className="register-box">

        <div className="user-icon">👤+</div>

        <h2>
          Donor <span>Registration</span>
        </h2>

        <p className="subtitle">
          Create your Food Bridge account
        </p>

        <form onSubmit={handleSubmit}>

          
<input
  type="text"
  placeholder="👤   Full Name"
  value={name}
  onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z ]/g, ""))}
  required
/>
          
<input
  type="email"
  placeholder="✉   Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
  title="Please enter a valid email address"
  required
/>

          
<input
  type="tel"
  placeholder="☎   Phone Number"
  value={mobile}
  onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, "").slice(0, 10))}
  maxLength={10}
  pattern="[0-9]{10}"
  title="Please enter a valid 10-digit phone number"
  required
/>
          <input
            type="password"
            placeholder="🔒   Password"
            minLength="8"
            required
            title="Password must be at least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="🔒   Confirm Password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

         
<input
  type="text"
  placeholder="📍   Location"
  value={location}
  onChange={(e) => setLocation(e.target.value)}
  required
/>

          {error && (
            <p style={{ color: "red", marginBottom: "10px" }}>
              {error}
            </p>
          )}

          <button type="submit" className="register-button">
            Register
          </button>

        </form>

        <p className="login-text">
           Already have an account?{" "}
           <span onClick={onLogin}>Login</span>
        </p>

      </div>

      <div className="side-message right-message">
        <h2>
          Good<br />
          Food<br />
          for a<br />
          Better<br />
          Tomorrow
        </h2>

        <div className="heart">♡</div>
      </div>

    </div>
  );
}

export default Register;