
import React, { useState, useEffect  } from "react";
import "./Settings.css";

function Settings({ onHome, email }) {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    mobile: ""
  });
  
useEffect(() => {
  if (!email) return;

  const loadProfile = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/profile?email=${encodeURIComponent(email)}`
      );

      if (response.status === 404) return;

      if (!response.ok) {
        throw new Error("Unable to load profile");
      }

      const data = await response.json();

      setProfile({
        name: data.name || "",
        email: data.email || "",
        mobile: data.mobile || ""
      });
    } catch (error) {
      console.error("Profile loading failed:", error);
    }
  };

  loadProfile();
}, [email]);
  
const [loading, setLoading] = useState(false);

useEffect(() => {
  const savedEmail = profile.email;

  if (!savedEmail) return;

  const loadProfile = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/profile?email=${encodeURIComponent(savedEmail)}`
      );

      if (!response.ok) {
        throw new Error("Unable to load profile");
      }

      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error("Profile load failed:", error);
    } finally {
      setLoading(false);
    }
  };

  loadProfile();
}, []);

  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
    setSaved(false);
  };

  
const handleSave = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:5000/api/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profile),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to save profile");
    }

    setEditing(false);
    setSaved(true);
    alert("Profile saved successfully!");
  } catch (error) {
    alert("Profile save failed: " + error.message);
  }
};

  return (
    <div className="settings-page">
      <header className="settings-header">
        <div>
          <span className="settings-tag">
            FOODBRIDGE ACCOUNT
          </span>
          <h1>Settings</h1>
          <p>Manage your account information.</p>
        </div>

        <button onClick={onHome}>
          ← Back to Dashboard
        </button>
      </header>

      <section className="settings-card">
        <div className="settings-profile-icon">👤</div>

        <h2>Profile Information</h2>
        <p>Your donor account details</p>

        {!editing ? (
          <>
            <div className="settings-info-row">
              <span>Name</span>
              <strong>{profile.name || "Not added"}</strong>
            </div>

            <div className="settings-info-row">
              <span>Email</span>
              <strong>{profile.email || "Not added"}</strong>
            </div>

            <div className="settings-info-row">
              <span>Mobile Number</span>
              <strong>{profile.mobile || "Not added"}</strong>
            </div>

            <div className="settings-info-row">
              <span>Account Type</span>
              <strong>Food Donor</strong>
            </div>

            <button
              type="button"
              onClick={() => setEditing(true)}
            >
              ✏️ Edit Profile
            </button>
          </>
        ) : (
          <form onSubmit={handleSave}>
            <input
              name="name"
              placeholder="Enter your name"
              value={profile.name}
              onChange={handleChange}
              required
            />

            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={profile.email}
              onChange={handleChange}
              required
            />

            <input
              name="mobile"
              type="tel"
              placeholder="Enter mobile number"
              value={profile.mobile}
              onChange={handleChange}
              required
            />

            <button type="submit">
              Save Changes
            </button>

            <button
              type="button"
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </form>
        )}

        {saved && (
          <p style={{ color: "green" }}>
            Profile saved successfully!
          </p>
        )}
      </section>

      <section className="settings-note">
        <span>🌱</span>
        <div>
          <h3>Thank you for sharing food!</h3>
          <p>
            Your donations can help reduce food waste
            and support people in need.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Settings;