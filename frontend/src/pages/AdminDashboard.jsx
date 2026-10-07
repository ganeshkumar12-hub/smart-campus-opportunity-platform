import { useNavigate } from 'react-router-dom'

function AdminDashboard() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className="dashboard-page">

      <div className="dashboard-container">

        <div className="dashboard-header">

          <div>
            <p className="dashboard-label">
              SMART CAMPUS
            </p>

            <h1>Admin Dashboard</h1>

            <p>
              Manage the Smart Campus platform.
            </p>
          </div>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

        <div className="dashboard-grid">

          <div className="dashboard-card">

            <div className="dashboard-card-icon">
              👥
            </div>

            <h2>Manage Users</h2>

            <p>
              View and manage students and employees.
            </p>

            <button
              onClick={() => navigate('/admin/users')}
            >
              Manage Users
            </button>

          </div>

          <div className="dashboard-card">

            <div className="dashboard-card-icon">
              💼
            </div>

            <h2>Manage Opportunities</h2>

            <p>
              View and manage campus opportunities.
            </p>

            <button
              onClick={() =>
                navigate('/employee/opportunities')
              }
            >
              Manage Opportunities
            </button>

          </div>

          <div className="dashboard-card">

            <div className="dashboard-card-icon">
              📄
            </div>

            <h2>Manage Applications</h2>

            <p>
              Review student applications.
            </p>

            <button
              onClick={() =>
                navigate('/employee/applications')
              }
            >
              Manage Applications
            </button>

          </div>

          <div className="dashboard-card">

            <div className="dashboard-card-icon">
              🤝
            </div>

            <h2>Manage Referrals</h2>

            <p>
              Review and manage referral requests.
            </p>

            <button
              onClick={() =>
                navigate('/employee/referrals')
              }
            >
              Manage Referrals
            </button>

          </div>

        </div>

      </div>

    </div>
  )
}

export default AdminDashboard