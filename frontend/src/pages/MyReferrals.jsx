import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function MyReferrals() {
  const [referrals, setReferrals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    const fetchReferrals = async () => {
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

        const response = await fetch(
          `http://localhost:8080/api/referrals/student/${encodeURIComponent(email)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!response.ok) {
          const message = await response.text()
          throw new Error(
            message || 'Failed to load referrals'
          )
        }

        const data = await response.json()

        setReferrals(data)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchReferrals()
  }, [navigate])

  return (
    <div className="referrals-page">

      <div className="page-header">
        <div>
          <p className="dashboard-label">
            SMART CAMPUS
          </p>

          <h1>My Referrals</h1>

          <p>
            View the referral requests you have submitted.
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
          Loading referrals...
        </p>
      )}

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      {!loading &&
        !error &&
        referrals.length === 0 && (
          <div className="empty-state">
            <h2>No Referrals Yet</h2>

            <p>
              You haven't submitted any referral requests yet.
            </p>
          </div>
        )}

      <div className="referrals-grid">

        {referrals.map((referral) => (

          <div
            className="referral-item"
            key={referral.id}
          >

            <div className="referral-item-header">

              <div>
                <p className="referral-number">
                  Referral #{referral.id}
                </p>

                <h2>
                  Opportunity #{referral.opportunityId}
                </h2>
              </div>

              <span
                className={`referral-status ${referral.status.toLowerCase()}`}
              >
                {referral.status}
              </span>

            </div>

            <div className="referral-info">

              <div>
                <strong>Referrer</strong>

                <p>
                  {referral.referrerEmail}
                </p>
              </div>

              <div>
                <strong>Message</strong>

                <p>
                  {referral.message}
                </p>
              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}

export default MyReferrals