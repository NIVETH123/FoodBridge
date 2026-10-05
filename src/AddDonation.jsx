import React, { useState } from "react";
import "./AddDonation.css";

function AddDonation({ onBack, onSubmitDonation }) {
  const [form, setForm] = useState({
    foodName: "",
    category: "",
    quantity: "",
    description: "",
    location: "",
    expiry: "",
    mobile: ""
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  
async function handleSubmit(e) {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:5000/api/donations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to save donation");
    }

    alert("Donation saved successfully!");

    if (onSubmitDonation) {
      onSubmitDonation(form);
    }

    onBack();
  } catch (error) {
    console.error("Donation error:", error);
    alert("Donation save failed. Check whether the backend is running.");
  }
}

  return (
    <div className="donation-page">
      <header className="donation-header">
        <h2>🍲 Food<span>Bridge</span></h2>
        <button type="button" onClick={onBack}>← Dashboard</button>
      </header>

      <main className="donation-container">
        <h1>Add Food Donation</h1>
        <p>Share your surplus food with people in need.</p>

        <form onSubmit={handleSubmit}>
          <label>Food Name</label>
          <input
            name="foodName"
            value={form.foodName}
            onChange={handleChange}
            placeholder="Enter food name"
            required
          />

          <label>Food Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          >
            <option value="">Select category</option>
            <option value="Cooked Food">Cooked Food</option>
            <option value="Fruits">Fruits</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Packed Food">Packed Food</option>
            <option value="Other">Other</option>
          </select>

          <label>Quantity</label>
          <input
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            placeholder="Example: 10 meals"
            required
          />

          <label>Food Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe the available food"
            required
          />

          <label>Pickup Location</label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Enter pickup address"
            required
          />

          <label>Expiry Date and Time</label>
          <input
            type="datetime-local"
            name="expiry"
            value={form.expiry}
            onChange={handleChange}
            min={new Date().toISOString().slice(0, 16)}
            required
          />

          <label>Contact Number</label>
          <input
            type="tel"
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            placeholder="Enter contact number"
            pattern="[0-9]{10}"
            maxLength="10"
            required
          />

          <button className="donation-submit" type="submit">
            Submit Donation
          </button>
        </form>
      </main>
    </div>
  );
}

export default AddDonation;