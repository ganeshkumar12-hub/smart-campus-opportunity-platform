import { useNavigate } from 'react-router-dom'

function EmployeeDashboard() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className="dashboard-page">

      <div className="dashboard-header">

        <div>
          <p className="dashboard-label">
            SMART CAMPUS
          </p>

          <h1>Employee Dashboard</h1>

          <p className="dashboard-welcome">
            Manage opportunities, applications, and referrals.
          </p>
        </div>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

      <div className="dashboard-cards">

        <div className="dashboard-card">

          <div className="card-icon">
            💼
          </div>

          <h2>Manage Opportunities</h2>

          <p>
            Create, update, and manage job and internship
            opportunities.
          </p>

          <button
            onClick={() => navigate('/employee/opportunities')}
          >
            Manage Opportunities
          </button>

        </div>

        <div className="dashboard-card">

          <div className="card-icon">
            📄
          </div>

          <h2>Applications</h2>

          <p>
            View applications submitted by students and
            manage their status.
          </p>

          <button
            onClick={() => navigate('/employee/applications')}
          >
            View Applications
          </button>

        </div>

        <div className="dashboard-card">

          <div className="card-icon">
            🤝
          </div>

          <h2>Referral Requests</h2>

          <p>
            View student referral requests and update their
            status.
          </p>

          <button
            onClick={() => navigate('/employee/referrals')}
          >
            View Referrals
          </button>

        </div>

      </div>

    </div>
  )
}

export default EmployeeDashboard