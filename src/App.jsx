import React from "react";
import "./App.css";
import Register from "./Register.jsx";
import Login from "./login.jsx";
import DonorDashboard from "./DonorDashboard.jsx";
import AddDonation from "./AddDonation.jsx";
import Reports from "./Reports.jsx";
import Redistribution from "./Redistribution.jsx";
import Settings from "./Settings.jsx";

function App() {
  const [page, setPage] = React.useState("home");
  const [donations, setDonations] = React.useState([]);
  const [loggedInEmail, setLoggedInEmail] = React.useState("");

  React.useEffect(() => {
  const openReports = () => setPage("reports");

  window.addEventListener("open-reports", openReports);

  return () => {
    window.removeEventListener("open-reports", openReports);
  };
}, []);

  if (page === "register") {
      return (
      <Register
      onHome={() => setPage("home")}
      onLogin={() => setPage("login")}
      />
    );
}
  

if (page === "login") {
  return (
    <Login
      onHome={() => setPage("home")}
      onRegister={() => setPage("register")}
      onLogin={(email) => {
        setLoggedInEmail(email);
        setPage("dashboard");
      }}
    />
  );
}

if (page === "addDonation") {
  return (
    <AddDonation
      onBack={() => setPage("dashboard")}
      onSubmitDonation={(donation) =>
        setDonations((previous) => [...previous, donation])
      }
    />
  );
}

if (page === "reports") {
  return <Reports onHome={() => setPage("dashboard")} />;
}

if (page === "redistribution") {
  return (
    <Redistribution
      onHome={() => setPage("dashboard")}
    />
  );
}


if (page === "settings") {
  return (
    <Settings
      onHome={() => setPage("dashboard")}
      email={loggedInEmail}
    />
  );
}

if (page === "dashboard") {
  return (
    <DonorDashboard
       onAddDonation={() => setPage("addDonation")}
       onReports={() => setPage("reports")}
       onRedistribution={() => setPage("redistribution")}
       onSettings={() => setPage("settings")}
       onLogout={() => setPage("login")}
       donations={donations}
    />
  )
}

  return (

    <div className="app">


      <section className="hero">

        <div className="hero-overlay"></div>


        <div className="hero-content">

          <div className="mini-title">
            FOOD DONATION MANAGEMENT SYSTEM
          </div>


          <h1>
            Food<span>Bridge</span>
          </h1>


          <h2>
            Food Donation Management System
          </h2>


          <div className="line"></div>


          <p className="tagline">
            Don't Waste Food, <span>Share It.</span>
          </p>


          <p className="description">
            FoodBridge connects food donors with NGOs
            and volunteers, helping surplus food reach
            people in need.
          </p>

          <button
            className="register-main"
            onClick={() => setPage("register")}
          >
           👤 Register Now
           <b>→</b>
          </button>

        </div>

      </section>

          </div>
  );
}
export default App;