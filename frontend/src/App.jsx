import { Link, Route, Routes } from "react-router-dom";
import CreateOpportunity from './pages/CreateOpportunity'
import "./App.css";
import ApplicationForm from "./pages/ApplicationForm";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Opportunities from "./pages/Opportunities";
import MyApplications from './pages/MyApplications'
import MyReferrals from './pages/MyReferrals'
import EmployeeDashboard from './pages/EmployeeDashboard'
import EmployeeOpportunities from './pages/EmployeeOpportunities'
import EmployeeApplications from './pages/EmployeeApplications'
import EmployeeReferrals from './pages/EmployeeReferrals' 
import EditOpportunity from './pages/EditOpportunity'
function Home() {
  return (
    <>
      <section id="home" className="hero-section">
        <div className="hero-content">
          <p className="subtitle">SMART CAMPUS PLATFORM</p>

          <h1>
            Discover Opportunities.
            <br />
            Build Your Future.
          </h1>

          <p className="hero-description">
            A centralized platform for students to discover jobs, internships,
            referrals, and career opportunities.
          </p>

          <div className="hero-buttons">
            <Link to="/dashboard" className="primary-btn">
              Explore Opportunities
            </Link>

            <Link to="/login" className="secondary-btn">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      <section id="opportunities" className="features-section">
        <h2>Everything You Need</h2>

        <div className="features">
          <div className="feature-card">
            <h3>Opportunities</h3>

            <p>Find internships, jobs, and other career opportunities.</p>
          </div>

          <div className="feature-card">
            <h3>Referrals</h3>

            <p>Connect with employees and request professional referrals.</p>
          </div>

          <div className="feature-card">
            <h3>Applications</h3>

            <p>Apply for opportunities and track your application status.</p>
          </div>
        </div>
      </section>
    </>
  );
}

function App() {
  return (
    <div className="app">
      {/* Navbar */}

      <nav className="navbar">
        <Link to="/" className="logo">
          Smart Campus
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>

          <Link to="/opportunities">Opportunities</Link>

          <a href="#about">About</a>

          <Link to="/login" className="login-btn">
            Login
          </Link>
        </div>
      </nav>

      {/* Routes */}

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/applications/new/:opportunityId"
          element={<ApplicationForm />}
        />
        <Route
  path="/employee/opportunities/new"
  element={<CreateOpportunity />}
/>
<Route
  path="/employee/applications"
  element={<EmployeeApplications />}
/>
<Route
  path="/employee/opportunities/edit/:id"
  element={<EditOpportunity />}
/>
        <Route
  path="/employee/dashboard"
  element={<EmployeeDashboard />}
/>
        <Route
  path="/referrals"
  element={<MyReferrals />}
/>
<Route
  path="/employee/opportunities"
  element={<EmployeeOpportunities />}
/>
        <Route path="/opportunities" element={<Opportunities />} />
        <Route
  path="/applications"
  element={<MyApplications />}
/>
<Route
  path="/employee/referrals"
  element={<EmployeeReferrals />}
/>
      </Routes>

      {/* Footer */}

      <footer id="about">
        <p>© 2026 Smart Campus Platform</p>
      </footer>
    </div>
  );
}

export default App;
