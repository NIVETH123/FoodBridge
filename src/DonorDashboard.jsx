import React, { useState, useEffect } from "react";
import "./DonorDashboard.css";

const donationData = [
  { date: "12-05-2025", recipient: "Local Shelter", status: "Complete", amount: "₹240" },
  { date: "12-05-2025", recipient: "Food Bank", status: "Pending", amount: "₹1280" },
  { date: "13-05-2025", recipient: "Community Kitchen", status: "Complete", amount: "₹3280" },
  { date: "14-05-2025", recipient: "Community Kitchen", status: "Complete", amount: "₹2300" },
];

function DonorDashboard({
  onAddDonation,
  onReports,
  onRedistribution,
  onSettings,
  onLogout,
  donations = []
}) {
  const [period, setPeriod] = useState("Month");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [dbDonations, setDbDonations] = useState([]);
  const [selectedDonation, setSelectedDonation] = useState(null);

const updateDonationStatus = async (id, status) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/donations/${id}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      }
    );

    if (!response.ok) {
      throw new Error("Status update failed");
    }

    setDbDonations((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, status } : item
      )
    );

    setSelectedDonation((previous) =>
      previous && previous.id === id
        ? { ...previous, status }
        : previous
    );

    alert("Donation status updated successfully!");
  } catch (error) {
    console.error(error);
    alert("Status update failed. Check the backend.");
  }
};

useEffect(() => {
  fetch("http://localhost:5000/api/donations")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch donations");
      }
      return response.json();
    })
    .then((data) => setDbDonations(data))
    .catch((error) => {
      console.error("Donation fetch error:", error);
    });
}, []);

const totalSurplus = dbDonations.reduce(
  (total, item) => total + (Number(item.quantity) || 0),
  0
);

const totalDonations = dbDonations.length;

const completedDonations = dbDonations.filter(
  (item) => item.status === "Complete"
).length;

const pendingDonations = dbDonations.filter(
  (item) => item.status !== "Complete"
).length;

const totalMeals = completedDonations;

const wasteReductionRate =
  totalDonations > 0
    ? Math.round((completedDonations / totalDonations) * 100)
    : 0;

  
const allDonations = [
  ...dbDonations.map((item) => ({
    id: item.id,
    date: item.createdAt
      ? new Date(item.createdAt).toLocaleDateString("en-GB")
      : "",
    recipient: item.foodName,
    status: item.status || "Pending",
    amount: item.quantity,
    category: item.category,
    location: item.location,
    description: item.description,
    expiry: item.expiry,
    mobile: item.mobile,
  })),
];

const filteredDonations = allDonations.filter((item) => {
  const matchesFilter =
    filter === "All" || item.status === filter;

  const matchesSearch =
    item.recipient.toLowerCase().includes(search.toLowerCase());

  return matchesFilter && matchesSearch;
});
  return (
    <div className="fb-dashboard">

      <aside className="fb-sidebar">
        <div className="fb-brand">
          <span className="fb-brand-icon">⬡</span>
          <span>Food<span className="fb-brand-light">Bridge</span></span>
        </div>

        <nav className="fb-nav">
          <a href="#fb-home" className="fb-nav-active">▦ Dashboard</a>
          <a href="#fb-surplus">◉ Surplus Food</a>
          <a
  href="#fb-redistribution"
  onClick={(e) => {
    e.preventDefault();
    if (onRedistribution) {
      onRedistribution();
    }
  }}
>
  ▣ Redistribution
</a>
          <a href="#fb-donations">♡ Donations</a>
          
         <a
             href="#reports"
             onClick={(e) => {
             e.preventDefault();
             if (onReports) {
             onReports();
             }
          }}
         >
            ▤ Reports
         </a>
          <a
  href="#fb-settings"
  onClick={(e) => {
    e.preventDefault();
    onSettings?.();
  }}
>
  ⚙ Settings
</a>
        </nav>

        <div className="fb-zero-waste">
          <div className="fb-food-emoji">🥗</div>
          <div className="fb-person-emoji">🧑‍🍳</div>
          <h2>ZERO<br />WASTE</h2>
          <p>Every meal matters.</p>
        </div>
      </aside>

      <main className="fb-main" id="fb-home">

        <header className="fb-topbar">
          <div>
            <h1>Dashboard</h1>
            <p>Track your surplus, donations, and waste reduction efforts.</p>
          </div>

          <div className="fb-top-actions">
            <input
              type="search"
              placeholder="⌕  Search recipients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search donations"
            />
           
          <button
              className="fb-add-button"
              onClick={onAddDonation}
          >
          <span>＋</span> Add Surplus
          </button>
            <span className="fb-notification" title="Notifications">♧</span>
            <span className="fb-avatar">👨🏻</span>
            <button
                  className="fb-logout-button"
                  onClick={onLogout}
            >
            <span>↪</span> Logout
            </button>
          </div>
        </header>

        <section className="fb-stats">
          <article className="fb-stat-card">
            <div>
              <p>Total Surplus Logged</p>
              <h2>{totalSurplus} Kg</h2>
              <span className="fb-positive">↑ 15% vs last month</span>
            </div>
            <span className="fb-stat-emoji">🥡</span>
          </article>

          <article className="fb-stat-card">
            <div>
              <p>Meals Provided</p>
              <h2>{totalMeals}</h2>
              <span className="fb-positive">↑ 8% vs last period</span>
            </div>
            <span className="fb-stat-emoji">🍱</span>
          </article>

          <article className="fb-stat-card">
            <div>
              <p>Waste Reduction Rate</p>
             <h2>{wasteReductionRate}%</h2>
              <span className="fb-negative">↓ 2% vs last period</span>
            </div>
            <span className="fb-stat-emoji">🥗</span>
          </article>
        </section>

        <section className="fb-analytics">

          <article className="fb-panel fb-trend-panel" id="fb-reports">
            <div className="fb-panel-heading">
              <div>
                <h3>Surplus Trend</h3>
                <p className="fb-positive">15% vs last 30 days</p>
              </div>

              <div className="fb-periods">
                {["Day", "Week", "Month"].map((item) => (
                  <button
                    key={item}
                    className={period === item ? "selected" : ""}
                    onClick={() => setPeriod(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="fb-chart">
              <div className="fb-chart-grid">
                <svg
                  viewBox="0 0 600 210"
                  preserveAspectRatio="none"
                  role="img"
                  aria-label={`Surplus trend chart for ${period}`}
                >
                  <defs>
                    <linearGradient id="fb-chart-fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#299f91" stopOpacity=".28" />
                      <stop offset="100%" stopColor="#299f91" stopOpacity=".02" />
                    </linearGradient>
                  </defs>

                  <path
                    d="M0 145 C40 130,55 125,80 137 S120 95,160 92 S205 105,240 65 S295 48,320 78 S370 120,400 100 S440 70,465 115 S510 150,525 90 S565 42,600 52 L600 210 L0 210 Z"
                    fill="url(#fb-chart-fill)"
                  />

                  <path
                    d="M0 145 C40 130,55 125,80 137 S120 95,160 92 S205 105,240 65 S295 48,320 78 S370 120,400 100 S440 70,465 115 S510 150,525 90 S565 42,600 52"
                    fill="none"
                    stroke="#299f91"
                    strokeWidth="2.5"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </div>

              <div className="fb-chart-labels">
                <span>{period === "Day" ? "Morning" : "Week 1"}</span>
                <span>{period === "Day" ? "Afternoon" : "Week 2"}</span>
                <span>{period === "Day" ? "Evening" : "Week 3"}</span>
                <span>{period === "Day" ? "Night" : "Week 4"}</span>
                <span>{period === "Month" ? "Week 5" : period === "Week" ? "Today" : "End"}</span>
              </div>
            </div>
          </article>

          <article className="fb-panel fb-performance">
            <h3>Performance Comparison</h3>

            <div className="fb-progress-label">
              <span>This Month</span>
              <strong>+10%</strong>
            </div>
            <div className="fb-progress-track">
              <div className="fb-progress-current" />
            </div>

            <div className="fb-progress-label fb-last-month">
              <span>Last Month</span>
            </div>
            <div className="fb-progress-track">
              <div className="fb-progress-previous" />
            </div>

            <h4>Alert</h4>
            <div className="fb-alert">
              <span className="fb-alert-icon">ⓘ</span>
              <div>
                <strong>High Surplus Alert</strong>
                <p>Consider donating soon to help reduce food waste.</p>
              </div>
            </div>
          </article>
        </section>

        <section className="fb-panel fb-activity" id="fb-donations">
          <div className="fb-activity-heading">
            <h3>Donation Activity</h3>

            <div className="fb-filters">
              {["All", "Complete", "Pending"].map((item) => (
                <button
                  key={item}
                  className={filter === item ? "active" : ""}
                  onClick={() => setFilter(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="fb-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Recipient</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredDonations.map((item, index) => (
                  <tr key={`${item.recipient}-${index}`}>
                    <td>{item.date}</td>
                    <td>{item.recipient}</td>
                    <td>
                      <span className={`fb-status ${item.status === "Complete" ? "complete" : "pending"}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>{item.amount}</td>
                    <td>
                      

<button
  className="fb-details"
  onClick={() => setSelectedDonation(item)}
>
  View Details
</button>
                    </td>
                  </tr>
                ))}

                {filteredDonations.length === 0 && (
                  <tr>
                    <td colSpan="5" className="fb-empty">
                      No donations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="fb-footer">
          <span>Terms of Use</span>
          <span>•</span>
          <span>Privacy Policy</span>
          <span>•</span>
          <span>FoodBridge</span>
          <span className="fb-copyright">© 2026 FoodBridge</span>
        </footer>

        
      {selectedDonation && (
        <div className="fb-modal-overlay">
          <div className="fb-modal">
            <button
              className="fb-modal-close"
              onClick={() => setSelectedDonation(null)}
            >
              ×
            </button>

            <h2>🍱 Donation Details</h2>

            
<div className="fb-modal-heading">
  <span className="fb-modal-title-icon">🍱</span>
  <div>
    <h2>Donation Details</h2>
    <p>FoodBridge Donation Information</p>
  </div>
</div>


<div
  className={`fb-modal-status ${
    selectedDonation.status === "Complete"
      ? "is-complete"
      : "is-pending"
  }`}
>
  <span className="fb-status-icon">
    {selectedDonation.status === "Complete" ? "✓" : "◷"}
  </span>

  <div>
    <p>Status</p>
    <strong>{selectedDonation.status || "Pending"}</strong>
  </div>
</div>

<div className="fb-food-card">
  <span>🍱 Food Name</span>
  <strong>
    {selectedDonation.foodName || selectedDonation.recipient || "N/A"}
  </strong>
</div>

<div className="fb-food-card">
  <span>🍽️ Quantity</span>
  <strong>
    {selectedDonation.quantity || selectedDonation.amount || "N/A"}
  </strong>
</div>

<div className="fb-food-card">
  <span>🏷️ Category</span>
  <strong>{selectedDonation.category || "N/A"}</strong>
</div>

<div className="fb-food-card">
  <span>📍 Location</span>
  <strong>{selectedDonation.location || "N/A"}</strong>
</div>

<div className="fb-food-card">
  <span>📅 Expiry Date</span>
  <strong>{selectedDonation.expiry || "N/A"}</strong>
</div>

<div className="fb-food-card">
  <span>📱 Mobile Number</span>
  <strong>{selectedDonation.mobile || "N/A"}</strong>
</div>

<div className="fb-food-card">
  <span>📝 Description</span>
  <strong>{selectedDonation.description || "No description"}</strong>
</div>


{selectedDonation && selectedDonation.status !== "Complete" && (
  <button
    className="fb-add-button"
    onClick={() =>
      updateDonationStatus(selectedDonation.id, "Complete")
    }
  >
    Mark as Complete
  </button>
)}

<button
  className="fb-modal-done"
  onClick={() => setSelectedDonation(null)}
>
  💚 Close Details
</button>
          </div>
        </div>
      )}

      </main>
    </div>
  );
}

export default DonorDashboard;