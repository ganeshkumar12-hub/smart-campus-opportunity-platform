import { Link, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

import './App.css'

import CreateOpportunity from './pages/CreateOpportunity'
import ApplicationForm from './pages/ApplicationForm'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './Register'
import Opportunities from './pages/Opportunities'
import MyApplications from './pages/MyApplications'
import MyReferrals from './pages/MyReferrals'
import EmployeeDashboard from './pages/EmployeeDashboard'
import EmployeeOpportunities from './pages/EmployeeOpportunities'
import EmployeeApplications from './pages/EmployeeApplications'
import EmployeeReferrals from './pages/EmployeeReferrals'
import EditOpportunity from './pages/EditOpportunity'
import RequestReferral from './pages/RequestReferral'
import AdminDashboard from './pages/AdminDashboard'
import AdminUsers from './pages/AdminUsers'

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
            A centralized platform for students to discover jobs,
            internships, referrals, and career opportunities.
          </p>

          <div className="hero-buttons">
            <Link to="/opportunities" className="primary-btn">
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
            <p>
              Find internships, jobs, and other career opportunities.
            </p>
          </div>

          <div className="feature-card">
            <h3>Referrals</h3>
            <p>
              Connect with employees and request professional referrals.
            </p>
          </div>

          <div className="feature-card">
            <h3>Applications</h3>
            <p>
              Apply for opportunities and track your application status.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

function Navbar() {
  const location = useLocation()

  const [loggedIn, setLoggedIn] = useState(
    () => Boolean(localStorage.getItem('token'))
  )

  useEffect(() => {
    setLoggedIn(Boolean(localStorage.getItem('token')))
  }, [location.pathname])

  const path = location.pathname

  const isAdmin = path.startsWith('/admin')
  const isEmployee = path.startsWith('/employee')

  const isStudent =
    path === '/dashboard' ||
    path === '/applications' ||
    path === '/referrals' ||
    path.startsWith('/applications/new/') ||
    path.startsWith('/referrals/new/')

  const dashboardPath = isAdmin
    ? '/admin/dashboard'
    : isEmployee
      ? '/employee/dashboard'
      : '/dashboard'

  const showPublicLinks = !loggedIn && path === '/'

  const handleLogout = () => {
    localStorage.removeItem('token')
    setLoggedIn(false)
    window.location.assign('/login')
  }

  return (
    <nav className="navbar">
      <Link to={loggedIn ? dashboardPath : '/'} className="logo">
        Smart Campus
      </Link>

      <div className="nav-links">
        {showPublicLinks && (
          <>
            <Link to="/">Home</Link>
            <Link to="/opportunities">Opportunities</Link>
            <a href="/#about">About</a>
          </>
        )}

        {loggedIn && isAdmin && (
          <>
            <Link to="/admin/dashboard">Dashboard</Link>
            <Link to="/admin/users">Manage Users</Link>
          </>
        )}

        {loggedIn && isEmployee && (
          <>
            <Link to="/employee/dashboard">Dashboard</Link>
            <Link to="/employee/opportunities">Opportunities</Link>
            <Link to="/employee/applications">Applications</Link>
            <Link to="/employee/referrals">Referrals</Link>
          </>
        )}

        {loggedIn && isStudent && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/opportunities">Opportunities</Link>
            <Link to="/applications">Applications</Link>
            <Link to="/referrals">Referrals</Link>
          </>
        )}

        {loggedIn ? (
          <button
            type="button"
            className="login-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <Link to="/login" className="login-btn">
            Login
          </Link>
        )}
      </div>
    </nav>
  )
}

function App() {
  return (
    <div className="app">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

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

        <Route path="/referrals" element={<MyReferrals />} />

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

        <Route
          path="/referrals/new/:opportunityId"
          element={<RequestReferral />}
        />

        <Route
          path="/admin/dashboard"
          element={<AdminDashboard />}
        />

        <Route path="/admin/users" element={<AdminUsers />} />
      </Routes>

      <footer id="about">
        <p>© 2026 Smart Campus Platform</p>
      </footer>
    </div>
  )
}

export default App