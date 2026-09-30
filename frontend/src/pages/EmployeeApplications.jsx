import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function EmployeeApplications() {
  const [opportunities, setOpportunities] = useState([])
  const [selectedOpportunity, setSelectedOpportunity] = useState('')
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [applicationsLoading, setApplicationsLoading] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const token = localStorage.getItem('token')

        if (!token) {
          navigate('/login')
          return
        }

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
  }, [navigate])

  const handleOpportunityChange = async (event) => {
    const opportunityId = event.target.value

    setSelectedOpportunity(opportunityId)
    setApplications([])
    setError('')

    if (!opportunityId) {
      return
    }

    try {
      const token = localStorage.getItem('token')

      setApplicationsLoading(true)

      const response = await fetch(
        `http://localhost:8080/api/applications/opportunity/${opportunityId}`,
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
      setApplicationsLoading(false)
    }
  }

  const updateStatus = async (applicationId, status) => {
    try {
      const token = localStorage.getItem('token')

      const response = await fetch(
        `http://localhost:8080/api/applications/${applicationId}/status?status=${status}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        const message = await response.text()
        throw new Error(
          message || 'Failed to update application status'
        )
      }

      const updatedApplication = await response.json()

      setApplications((previous) =>
        previous.map((application) =>
          application.id === updatedApplication.id
            ? updatedApplication
            : application
        )
      )
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div className="applications-page">

      <div className="page-header">

        <div>
          <p className="dashboard-label">
            SMART CAMPUS
          </p>

          <h1>Student Applications</h1>

          <p>
            Review applications submitted for your opportunities.
          </p>
        </div>

        <button
          className="back-btn"
          onClick={() => navigate('/employee/dashboard')}
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

      {!loading && opportunities.length > 0 && (
        <div className="form-group employee-select-group">

          <label htmlFor="opportunity">
            Select Opportunity
          </label>

          <select
            id="opportunity"
            value={selectedOpportunity}
            onChange={handleOpportunityChange}
          >
            <option value="">
              Select an opportunity
            </option>

            {opportunities.map((opportunity) => (
              <option
                key={opportunity.id}
                value={opportunity.id}
              >
                {opportunity.title} - {opportunity.company}
              </option>
            ))}
          </select>

        </div>
      )}

      {applicationsLoading && (
        <p className="status-message">
          Loading applications...
        </p>
      )}

      {!applicationsLoading &&
        selectedOpportunity &&
        applications.length === 0 && (
          <div className="empty-state">
            <h2>No Applications</h2>

            <p>
              No students have applied for this opportunity yet.
            </p>
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
                  {application.studentEmail}
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

            <div className="employee-application-actions">

              <button
                className="accept-btn"
                onClick={() =>
                  updateStatus(
                    application.id,
                    'ACCEPTED'
                  )
                }
                disabled={application.status === 'ACCEPTED'}
              >
                Accept
              </button>

              <button
                className="reject-btn"
                onClick={() =>
                  updateStatus(
                    application.id,
                    'REJECTED'
                  )
                }
                disabled={application.status === 'REJECTED'}
              >
                Reject
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}

export default EmployeeApplications