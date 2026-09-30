import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function EmployeeOpportunities() {
  const [opportunities, setOpportunities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const navigate = useNavigate()

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

  useEffect(() => {
    fetchOpportunities()
  }, [])

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this opportunity?'
    )

    if (!confirmed) {
      return
    }

    try {
      const token = localStorage.getItem('token')

      const response = await fetch(
        `http://localhost:8080/api/opportunities/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        const message = await response.text()

        throw new Error(
          message || 'Failed to delete opportunity'
        )
      }

      setOpportunities((previous) =>
        previous.filter(
          (opportunity) => opportunity.id !== id
        )
      )
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div className="opportunities-page">

      <div className="page-header">

        <div>
          <p className="dashboard-label">
            SMART CAMPUS
          </p>

          <h1>Manage Opportunities</h1>

          <p>
            Create and manage jobs, internships, and career
            opportunities.
          </p>
        </div>

        <button
          className="back-btn"
          onClick={() => navigate('/employee/dashboard')}
        >
          Back to Dashboard
        </button>

      </div>

      <div className="employee-actions">

        <button
          className="apply-btn"
          onClick={() =>
            navigate('/employee/opportunities/new')
          }
        >
          + Create Opportunity
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

      {!loading &&
        !error &&
        opportunities.length === 0 && (
          <div className="empty-state">
            <h2>No Opportunities Available</h2>

            <p>
              You have not created any opportunities yet.
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

            <h2>
              {opportunity.title}
            </h2>

            <h3>
              {opportunity.company}
            </h3>

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

            <div className="employee-opportunity-actions">

              <button
                className="apply-btn"
                onClick={() =>
                  navigate(
                    `/employee/opportunities/edit/${opportunity.id}`
                  )
                }
              >
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={() =>
                  handleDelete(opportunity.id)
                }
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}

export default EmployeeOpportunities