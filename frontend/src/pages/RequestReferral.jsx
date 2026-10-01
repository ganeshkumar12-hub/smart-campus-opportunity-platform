import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function RequestReferral() {
  const { opportunityId } = useParams()
  const navigate = useNavigate()

  const [employees, setEmployees] = useState([])
  const [referrerEmail, setReferrerEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem('token')

        if (!token) {
          navigate('/login')
          return
        }

        const response = await fetch(
          'http://localhost:8080/api/users/employees',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!response.ok) {
          const responseMessage = await response.text()

          throw new Error(
            responseMessage || 'Failed to load employees'
          )
        }

        const data = await response.json()

        setEmployees(data)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchEmployees()
  }, [navigate])

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setSuccess('')
    setSubmitting(true)

    try {
      const token = localStorage.getItem('token')

      if (!token) {
        navigate('/login')
        return
      }

      const response = await fetch(
        'http://localhost:8080/api/referrals',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            opportunityId: Number(opportunityId),
            referrerEmail,
            message,
          }),
        }
      )

      if (!response.ok) {
        const responseMessage = await response.text()

        throw new Error(
          responseMessage ||
            'Failed to submit referral request'
        )
      }

      const referral = await response.json()

      setSuccess(
        `Referral request submitted successfully. Status: ${referral.status}`
      )

      setReferrerEmail('')
      setMessage('')
    } catch (error) {
      setError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="application-page">

      <div className="application-card">

        <p className="dashboard-label">
          SMART CAMPUS
        </p>

        <h1>Request Referral</h1>

        <p className="application-subtitle">
          Ask an employee to refer you for this opportunity.
        </p>

        <div className="opportunity-id">
          Opportunity ID: {opportunityId}
        </div>

        {loading ? (
          <p className="status-message">
            Loading employees...
          </p>
        ) : (
          <form onSubmit={handleSubmit}>

            <div className="form-group">

              <label htmlFor="referrerEmail">
                Select Employee
              </label>

              <select
                id="referrerEmail"
                value={referrerEmail}
                onChange={(event) =>
                  setReferrerEmail(event.target.value)
                }
                required
              >
                <option value="">
                  Select an employee
                </option>

                {employees.map((employee) => (
                  <option
                    key={employee.id}
                    value={employee.email}
                  >
                    {employee.name} - {employee.email}
                  </option>
                ))}
              </select>

            </div>

            <div className="form-group">

              <label htmlFor="message">
                Message
              </label>

              <textarea
                id="message"
                value={message}
                onChange={(event) =>
                  setMessage(event.target.value)
                }
                placeholder="Write a message explaining why you are requesting this referral..."
                rows="8"
                required
              />

            </div>

            {error && (
              <p className="application-error">
                {error}
              </p>
            )}

            {success && (
              <p className="application-success">
                {success}
              </p>
            )}

            <div className="application-actions">

              <button
                type="button"
                className="back-btn"
                onClick={() =>
                  navigate('/opportunities')
                }
              >
                Back
              </button>

              <button
                type="submit"
                className="apply-submit"
                disabled={submitting}
              >
                {submitting
                  ? 'Submitting...'
                  : 'Request Referral'}
              </button>

            </div>

          </form>
        )}

      </div>

    </div>
  )
}

export default RequestReferral