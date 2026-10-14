
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

  const [loading, setLoading] = useState(true)



  useEffect(() => {
    let isMounted = true

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
          fetch('http://localhost:8080/api/opportunities', {
            headers,
          }),
          fetch(
            `http://localhost:8080/api/applications/student/${encodeURIComponent(email)}`,
            { headers }
          ),
          fetch(
            `http://localhost:8080/api/referrals/student/${encodeURIComponent(email)}`,
            { headers }
          ),
        ])

        if (
          !opportunitiesResponse.ok ||
          !applicationsResponse.ok ||
          !referralsResponse.ok
        ) {
          throw new Error('Failed to load dashboard statistics')
        }

        const [opportunities, applications, referrals] =
          await Promise.all([
            opportunitiesResponse.json(),
            applicationsResponse.json(),
            referralsResponse.json(),
          ])

        if (!Array.isArray(opportunities) ||
            !Array.isArray(applications) ||
            !Array.isArray(referrals)) {
          throw new Error('Unexpected dashboard response format')
        }

        const pendingApplications = applications.filter(
          (application) => application.status === 'PENDING'
        ).length

        if (isMounted) {
          setStats({
            opportunities: opportunities.length,
            applications: applications.length,
            pendingApplications,
            referrals: referrals.length,
          })
        }
      } catch (error) {
        console.error('Dashboard statistics error:', error)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchStats()

    return () => {
      isMounted = false
    }
  }, [navigate])

  const statItems = [
    {
      label: 'Total Opportunities',
      value: stats.opportunities,
      icon: '💼',
      color: 'blue',
    },
    {
      label: 'My Applications',
      value: stats.applications,
      icon: '📄',
      color: 'purple',
    },
    {
      label: 'Pending Applications',
      value: stats.pendingApplications,
      icon: '⏳',
      color: 'orange',
    },
    {
      label: 'My Referrals',
      value: stats.referrals,
      icon: '🤝',
      color: 'green',
    },
  ]

  const dashboardItems = [
    {
      title: 'Explore Opportunities',
      description:
        'Discover jobs, internships, and career opportunities that match your goals.',
      icon: '💼',
      button: 'Browse Opportunities',
      path: '/opportunities',
      color: 'blue',
    },
    {
      title: 'My Applications',
      description:
        'Keep track of your applications and follow their progress in one place.',
      icon: '📄',
      button: 'View Applications',
      path: '/applications',
      color: 'purple',
    },
    {
      title: 'My Referrals',
      description:
        'Manage your referral requests and explore opportunities through connections.',
      icon: '🤝',
      button: 'View Referrals',
      path: '/referrals',
      color: 'green',
    },
  ]

  return (
    <main className="dashboard-page dashboard-redesign">
      <section className="dashboard-header">
        <div>
          <p className="dashboard-label">YOUR CAREER SPACE</p>
          <h1>Welcome to your dashboard</h1>
          <p className="dashboard-welcome">
            Your next opportunity starts here. Track applications,
            explore careers, and build meaningful connections.
          </p>
        </div>

      </section>

      <section className="dashboard-overview">
        <div className="section-heading">
          <div>
            <h2>Your overview</h2>
            <p>Here is a snapshot of your career activity.</p>
          </div>
          <span className="overview-badge">
            {loading ? 'Updating...' : 'Live overview'}
          </span>
        </div>

        <div className="dashboard-stats">
          {statItems.map((item) => (
            <article
              className={`stat-card stat-${item.color}`}
              key={item.label}
            >
              <div className="stat-card-top">
                <span className="stat-icon" aria-hidden="true">
                  {item.icon}
                </span>
                <span className="stat-indicator" />
              </div>

              <p>{item.label}</p>

              <h2>
                {loading ? '—' : item.value}
              </h2>
            </article>
          ))}
        </div>
      </section>

      <section className="dashboard-actions">
        <div className="section-heading">
          <div>
            <h2>Quick access</h2>
            <p>Everything you need to move forward.</p>
          </div>
        </div>

        <div className="dashboard-cards">
          {dashboardItems.map((item) => (
            <article
              className={`dashboard-card action-card action-${item.color}`}
              key={item.title}
            >
              <div className="card-icon" aria-hidden="true">
                {item.icon}
              </div>

              <div className="action-card-content">
                <h2>{item.title}</h2>
                <p>{item.description}</p>
              </div>

              <button
                type="button"
                onClick={() => navigate(item.path)}
              >
                {item.button}
                <span aria-hidden="true"> →</span>
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Dashboard
