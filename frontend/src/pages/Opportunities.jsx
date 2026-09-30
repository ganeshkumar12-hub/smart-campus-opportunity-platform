import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Opportunities() {
  const [opportunities, setOpportunities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const token = localStorage.getItem('token')

        const response = await fetch(
          'http://localhost:8080/api/opportunities',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!response.ok) {
          throw new Error('Failed to load opportunities')
        }

        const data = await response.json()

        setOpportunities(data)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOpportunities()
  }, [])

  return (
    <div className="opportunities-page">

      <div className="page-header">
        <div>
          <p className="dashboard-label">
            SMART CAMPUS
          </p>

          <h1>Opportunities</h1>

          <p>
            Explore jobs, internships, and career opportunities.
          </p>
        </div>

        <button
          className="back-btn"
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </button>
      </div>

      {loading && (
        <p className="status-message">
          Loading opportunities...
        </p>
      )}

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      {!loading && !error && opportunities.length === 0 && (
        <div className="empty-state">
          <h2>No Opportunities Available</h2>

          <p>
            There are currently no opportunities posted.
          </p>
        </div>
      )}

      <div className="opportunities-grid">
        {opportunities.map((opportunity) => (
          <div
            className="opportunity-card"
            key={opportunity.id}
          >
            <div className="opportunity-type">
              {opportunity.type}
            </div>

            <h2>{opportunity.title}</h2>

            <h3>{opportunity.company}</h3>

            <p className="opportunity-description">
              {opportunity.description}
            </p>

            <div className="opportunity-details">
              <span>
                📍 {opportunity.location}
              </span>

              <span>
                🛠 {opportunity.skills}
              </span>

              <span>
                📅 Deadline: {opportunity.deadline}
              </span>
            </div>

            <button
              className="apply-btn"
              onClick={() =>
                navigate(`/applications/new/${opportunity.id}`)
              }
            >
              Apply Now
            </button>
          </div>
        ))}
      </div>

    </div>
  )
}

export default Opportunities