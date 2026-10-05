
import React, { useEffect, useState } from "react";
import "./Reports.css";

function Reports({ onHome }) {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/donations")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch donations");
        }
        return response.json();
      })
      .then((data) => setDonations(data))
      .catch((error) => console.error("Reports error:", error))
      .finally(() => setLoading(false));
  }, []);

  const totalQuantity = donations.reduce(
    (total, item) => total + (Number(item.quantity) || 0),
    0
  );

  const completed = donations.filter(
    (item) => item.status === "Complete"
  ).length;

  const pending = donations.filter(
    (item) => item.status !== "Complete"
  ).length;

  return (
    <div className="reports-page">
      <header className="reports-header">
        <div>
          <h1>Donation Reports</h1>
          <p>FoodBridge donation summary</p>
        </div>

        <button onClick={onHome}>Back to Dashboard</button>
        
<button onClick={() => window.print()}>
  🖨️ Print Report
</button>
      </header>

      {loading ? (
        <p>Loading reports...</p>
      ) : (
        <>
          <div className="reports-cards">
            <div className="report-card">
              <h3>Total Donations</h3>
              <h2>{donations.length}</h2>
            </div>

            <div className="report-card">
              <h3>Total Food Quantity</h3>
              <h2>{totalQuantity} Kg</h2>
            </div>

            <div className="report-card">
              <h3>Completed Donations</h3>
              <h2>{completed}</h2>
            </div>

            <div className="report-card">
              <h3>Pending Donations</h3>
              <h2>{pending}</h2>
            </div>
          </div>

          <div className="reports-table">
            <h2>Donation Details</h2>

            <div className="reports-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Food Name</th>
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {donations.length > 0 ? (
                    donations.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.foodName}</td>
                        <td>{item.category}</td>
                        <td>
  {item.quantity}
  {String(item.quantity).toLowerCase().includes("meal")
    ? ""
    : " Kg"}
</td>
                        <td>
                          <span
                            className={
                              item.status === "Complete"
                                ? "report-status complete"
                                : "report-status pending"
                            }
                          >
                            {item.status || "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">No donations found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Reports;