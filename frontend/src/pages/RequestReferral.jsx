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
    let isMounted = true

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

        if (isMounted) {
          setEmployees(data)
        }
      } catch (error) {
        if (isMounted) {
          setError(error.message)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchEmployees()

    return () => {
      isMounted = false
    }
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
            message: message.trim(),
          }),
        }
      )

      if (!response.ok) {
        const responseMessage = await response.text()

        throw new Error(
          responseMessage || 'Failed to submit referral request'
        )
      }

      const referral = await response.json()

      setSuccess(
        `Your referral request was submitted successfully. Status: ${referral.status}`
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
    <main className="application-page referral-page">
      <section className="application-card referral-card">
        <div className="referral-heading">
          <div className="referral-heading-icon" aria-hidden="true">
            🤝
          </div>

          <p className="dashboard-label">SMART CAMPUS</p>

          <h1>Request a Referral</h1>

          <p className="application-subtitle">
            Connect with an employee who can help you take the next
            step in your career.
          </p>
        </div>

        <div className="opportunity-id referral-opportunity">
          <span className="referral-opportunity-icon" aria-hidden="true">
            💼
          </span>

          <span>
            Opportunity ID
            <strong>#{opportunityId}</strong>
          </span>
        </div>

        {loading ? (
          <div className="referral-loading" role="status">
            <span className="referral-spinner" />
            <p>Finding available employees...</p>
          </div>
        ) : (
          <form className="referral-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="referrerEmail">
                Select an employee
              </label>

              <select
                id="referrerEmail"
                value={referrerEmail}
                onChange={(event) =>
                  setReferrerEmail(event.target.value)
                }
                required
                disabled={employees.length === 0 || submitting}
              >
                <option value="">
                  Choose an employee to contact
                </option>

                {employees.map((employee) => (
                  <option
                    key={employee.id}
                    value={employee.email}
                  >
                    {employee.name} — {employee.email}
                  </option>
                ))}
              </select>

              {employees.length === 0 && (
                <p className="referral-field-hint">
                  No employees are currently available to select.
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="message">
                Your message
              </label>

              <textarea
                id="message"
                value={message}
                onChange={(event) =>
                  setMessage(event.target.value)
                }
                placeholder="Introduce yourself, explain your interest in this opportunity, and politely ask for a referral..."
                rows={6}
                maxLength={1000}
                required
                disabled={submitting}
              />

              <div className="referral-message-footer">
                <span>Keep your message clear and professional.</span>
                <span>{message.length}/1000</span>
              </div>
            </div>

            {error && (
              <div className="referral-alert referral-alert-error" role="alert">
                {error}
              </div>
            )}

            {success && (
              <div
                className="referral-alert referral-alert-success"
                role="status"
              >
                {success}
              </div>
            )}

            <div className="application-actions referral-actions">
              <button
                type="button"
                className="back-btn"
                onClick={() => navigate('/opportunities')}
                disabled={submitting}
              >
                ← Back to opportunities
              </button>

              <button
                type="submit"
                className="apply-submit referral-submit"
                disabled={submitting || loading || employees.length === 0}
              >
                {submitting ? 'Submitting...' : 'Send referral request →'}
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  )
}

export default RequestReferral  