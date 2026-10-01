import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const navigate = useNavigate()

  const [stats, setStats] = useState({
    opportunities: 0,
    applications: 0,
    pendingApplications: 0,
    referrals: 0,
  })

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token')

        if (!token) {
          navigate('/login')
          return
        }

        const payload = JSON.parse(
          atob(token.split('.')[1])
        )

        const email = payload.sub

        const headers = {
          Authorization: `Bearer ${token}`,
        }

        const [
          opportunitiesResponse,
          applicationsResponse,
          referralsResponse,
        ] = await Promise.all([
          fetch(
            'http://localhost:8080/api/opportunities',
            {
              headers,
            }
          ),

          fetch(
            `http://localhost:8080/api/applications/student/${encodeURIComponent(email)}`,
            {
              headers,
            }
          ),

          fetch(
            `http://localhost:8080/api/referrals/student/${encodeURIComponent(email)}`,
            {
              headers,
            }
          ),
        ])

        if (
          !opportunitiesResponse.ok ||
          !applicationsResponse.ok ||
          !referralsResponse.ok
        ) {
          throw new Error(
            'Failed to load dashboard statistics'
          )
        }

        const opportunities =
          await opportunitiesResponse.json()

        const applications =
          await applicationsResponse.json()

        const referrals =
          await referralsResponse.json()

        const pendingApplications =
          applications.filter(
            (application) =>
              application.status === 'PENDING'
          ).length

        setStats({
          opportunities: opportunities.length,
          applications: applications.length,
          pendingApplications:
            pendingApplications,
          referrals: referrals.length,
        })
      } catch (error) {
        console.error(
          'Dashboard statistics error:',
          error
        )
      }
    }

    fetchStats()
  }, [navigate])

  return (
    <div className="dashboard-page">

      {/* Dashboard Header */}

      <div className="dashboard-header">

        <div>

          <p className="dashboard-label">
            SMART CAMPUS
          </p>

          <h1>Dashboard</h1>

          <p className="dashboard-welcome">
            Welcome to your Smart Campus dashboard.
          </p>

        </div>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>


      {/* Dashboard Statistics */}

      <div className="dashboard-stats">

        <div className="stat-card">

          <span className="stat-icon">
            💼
          </span>

          <div>

            <p>Total Opportunities</p>

            <h2>
              {stats.opportunities}
            </h2>

          </div>

        </div>


        <div className="stat-card">

          <span className="stat-icon">
            📄
          </span>

          <div>

            <p>My Applications</p>

            <h2>
              {stats.applications}
            </h2>

          </div>

        </div>


        <div className="stat-card">

          <span className="stat-icon">
            ⏳
          </span>

          <div>

            <p>Pending Applications</p>

            <h2>
              {stats.pendingApplications}
            </h2>

          </div>

        </div>


        <div className="stat-card">

          <span className="stat-icon">
            🤝
          </span>

          <div>

            <p>My Referrals</p>

            <h2>
              {stats.referrals}
            </h2>

          </div>

        </div>

      </div>


      {/* Dashboard Cards */}

      <div className="dashboard-cards">

        <div className="dashboard-card">

          <div className="card-icon">
            💼
          </div>

          <h2>
            Opportunities
          </h2>

          <p>
            Explore jobs, internships, and other
            career opportunities.
          </p>

          <button
            onClick={() =>
              navigate('/opportunities')
            }
          >
            View Opportunities
          </button>

        </div>


        <div className="dashboard-card">

          <div className="card-icon">
            📄
          </div>

          <h2>
            My Applications
          </h2>

          <p>
            Track the opportunities you have
            applied for.
          </p>

          <button
            onClick={() =>
              navigate('/applications')
            }
          >
            View Applications
          </button>

        </div>


        <div className="dashboard-card">

          <div className="card-icon">
            🤝
          </div>

          <h2>
            My Referrals
          </h2>

          <p>
            View and manage your referral requests.
          </p>

          <button
            onClick={() =>
              navigate('/referrals')
            }
          >
            View Referrals
          </button>

        </div>

      </div>

    </div>
  )
}

export default Dashboard