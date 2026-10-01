import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function EmployeeDashboard() {
  const navigate = useNavigate()

  const [stats, setStats] = useState({
    opportunities: 0,
    applications: 0,
    referrals: 0,
    pendingReferrals: 0,
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

        const headers = {
          Authorization: `Bearer ${token}`,
        }

        const [
          opportunitiesResponse,
          referralsResponse,
        ] = await Promise.all([
          fetch(
            'http://localhost:8080/api/opportunities',
            {
              headers,
            }
          ),

          fetch(
            'http://localhost:8080/api/referrals',
            {
              headers,
            }
          ),
        ])

        if (
          !opportunitiesResponse.ok ||
          !referralsResponse.ok
        ) {
          throw new Error(
            'Failed to load employee statistics'
          )
        }

        const opportunities =
          await opportunitiesResponse.json()

        const referrals =
          await referralsResponse.json()

        let totalApplications = 0

        /*
         * Get applications for every opportunity.
         */
        for (const opportunity of opportunities) {
          const response = await fetch(
            `http://localhost:8080/api/applications/opportunity/${opportunity.id}`,
            {
              headers,
            }
          )

          if (response.ok) {
            const applications =
              await response.json()

            totalApplications += applications.length
          }
        }

        const pendingReferrals =
          referrals.filter(
            (referral) =>
              referral.status === 'PENDING'
          ).length

        setStats({
          opportunities: opportunities.length,
          applications: totalApplications,
          referrals: referrals.length,
          pendingReferrals,
        })
      } catch (error) {
        console.error(
          'Employee dashboard statistics error:',
          error
        )
      }
    }

    fetchStats()
  }, [navigate])

  return (
    <div className="dashboard-page">

      {/* Header */}

      <div className="dashboard-header">

        <div>

          <p className="dashboard-label">
            SMART CAMPUS
          </p>

          <h1>
            Employee Dashboard
          </h1>

          <p className="dashboard-welcome">
            Manage opportunities, applications,
            and referrals.
          </p>

        </div>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>


      {/* Statistics */}

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

            <p>Total Applications</p>

            <h2>
              {stats.applications}
            </h2>

          </div>

        </div>


        <div className="stat-card">

          <span className="stat-icon">
            🤝
          </span>

          <div>

            <p>Total Referrals</p>

            <h2>
              {stats.referrals}
            </h2>

          </div>

        </div>


        <div className="stat-card">

          <span className="stat-icon">
            ⏳
          </span>

          <div>

            <p>Pending Referrals</p>

            <h2>
              {stats.pendingReferrals}
            </h2>

          </div>

        </div>

      </div>


      {/* Employee Dashboard Cards */}

      <div className="dashboard-cards">

        <div className="dashboard-card">

          <div className="card-icon">
            💼
          </div>

          <h2>
            Manage Opportunities
          </h2>

          <p>
            Create, update, and manage job and
            internship opportunities.
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

          <div className="card-icon">
            📄
          </div>

          <h2>
            Applications
          </h2>

          <p>
            View applications submitted by students
            and manage their status.
          </p>

          <button
            onClick={() =>
              navigate('/employee/applications')
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
            Referral Requests
          </h2>

          <p>
            View student referral requests and
            update their status.
          </p>

          <button
            onClick={() =>
              navigate('/employee/referrals')
            }
          >
            View Referrals
          </button>

        </div>

      </div>

    </div>
  )
}

export default EmployeeDashboard