import { Link, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import './App.css'

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

function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <Link to="/" className="logo">
          Smart Campus
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <a href="#opportunities">Opportunities</a>
          <a href="#about">About</a>

          <Link to="/login" className="login-btn">
            Login
          </Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>

      <footer id="about">
        <p>© 2026 Smart Campus Platform</p>
      </footer>
    </div>
  )
}

export default App