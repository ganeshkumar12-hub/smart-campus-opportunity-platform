import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function MyApplications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem('token')

        if (!token) {
          navigate('/login')
          return
        }

        // Get the logged-in user's email from the JWT
        const payload = JSON.parse(
          atob(token.split('.')[1])
        )

        const email = payload.sub

        const response = await fetch(
          `http://localhost:8080/api/applications/student/${encodeURIComponent(email)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!response.ok) {
          throw new Error('Failed to load applications')
        }

        const data = await response.json()

        setApplications(data)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
  }, [navigate])

  return (
    <div className="applications-page">

      <div className="page-header">
        <div>
          <p className="dashboard-label">
            SMART CAMPUS
          </p>

          <h1>My Applications</h1>

          <p>
            Track the applications you have submitted.
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
          Loading applications...
        </p>
      )}

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      {!loading &&
        !error &&
        applications.length === 0 && (
          <div className="empty-state">
            <h2>No Applications Yet</h2>

            <p>
              You haven't applied for any opportunities yet.
            </p>

            <button
              className="apply-btn"
              onClick={() => navigate('/opportunities')}
            >
              Explore Opportunities
            </button>
          </div>
        )}

      <div className="applications-grid">

        {applications.map((application) => (

          <div
            className="application-item"
            key={application.id}
          >

            <div className="application-item-header">

              <div>
                <p className="application-number">
                  Application #{application.id}
                </p>

                <h2>
                  Opportunity #{application.opportunityId}
                </h2>
              </div>

              <span
                className={`application-status ${application.status.toLowerCase()}`}
              >
                {application.status}
              </span>

            </div>

            <div className="application-info">

              <div>
                <strong>Resume</strong>

                <a
                  href={application.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  View Resume
                </a>
              </div>

              <div>
                <strong>Cover Letter</strong>

                <p>
                  {application.coverLetter}
                </p>
              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}

export default MyApplications