
import React, { useEffect, useState } from "react";
import "./Redistribution.css";

function Redistribution({ onHome }) {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/donations")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load donations");
        }
        return response.json();
      })
      .then((data) => setDonations(data))
      .catch((error) => console.error("Redistribution error:", error))
      .finally(() => setLoading(false));
  }, []);

  const availableDonations = donations.filter((item) => {
    const foodName = (item.foodName || "").toLowerCase();
    const location = (item.location || "").toLowerCase();
    const query = search.toLowerCase();

    return (
      item.status !== "Complete" &&
      (foodName.includes(query) || location.includes(query))
    );
  });

  return (
    <div className="redistribution-page">
      <header className="redistribution-header">
        <div>
          <span className="redistribution-tag">
            FOODBRIDGE • FOOD SHARING
          </span>
          <h1>Food Redistribution</h1>
          <p>
            Help available food reach people who need it.
          </p>
        </div>

        <button onClick={onHome}>
          ← Back to Dashboard
        </button>
      </header>

      <div className="redistribution-summary">
        <div className="redistribution-stat">
          <span>🍱</span>
          <div>
            <p>Available Donations</p>
            <h2>{availableDonations.length}</h2>
          </div>
        </div>

        <div className="redistribution-stat">
          <span>🤝</span>
          <div>
            <p>Completed Donations</p>
            <h2>
              {donations.filter(
                (item) => item.status === "Complete"
              ).length}
            </h2>
          </div>
        </div>
      </div>

      <section className="redistribution-list">
        <div className="redistribution-list-header">
          <div>
            <h2>Available Food</h2>
            <p>Find food donations waiting for collection.</p>
          </div>

          <input
            type="text"
            placeholder="Search food or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <p className="redistribution-message">
            Loading donations...
          </p>
        ) : availableDonations.length === 0 ? (
          <div className="redistribution-empty">
            <span>🍃</span>
            <h3>No available donations</h3>
            <p>
              New pending food donations will appear here.
            </p>
          </div>
        ) : (
          <div className="redistribution-grid">
            {availableDonations.map((item) => (
              <article
                className="redistribution-card"
                key={item.id}
              >
                <div className="redistribution-card-top">
                  <span className="food-icon">🍱</span>
                  <span className="available-badge">
                    ● Pending
                  </span>
                </div>

                <h3>{item.foodName}</h3>

                <p className="food-category">
                  {item.category || "Food donation"}
                </p>

                <div className="food-info">
                  <p>
                    <strong>Quantity</strong>
                    <span>{item.quantity}</span>
                  </p>

                  <p>
                    <strong>Location</strong>
                    <span>{item.location || "Not provided"}</span>
                  </p>

                  <p>
                    <strong>Expiry</strong>
                    <span>{item.expiry || "Not provided"}</span>
                  </p>
                </div>

                <div className="redistribution-note">
                  Please verify food safety and expiry before
                  collection.
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Redistribution;