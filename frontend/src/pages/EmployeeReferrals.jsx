import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function EmployeeReferrals() {
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

        const response = await fetch(
          'http://localhost:8080/api/referrals',
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

  const updateStatus = async (referralId, status) => {
    try {
      const token = localStorage.getItem('token')

      const response = await fetch(
        `http://localhost:8080/api/referrals/${referralId}/status?status=${status}`,
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
          message || 'Failed to update referral status'
        )
      }

      const updatedReferral = await response.json()

      setReferrals((previous) =>
        previous.map((referral) =>
          referral.id === updatedReferral.id
            ? updatedReferral
            : referral
        )
      )
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <div className="referrals-page">

      <div className="page-header">

        <div>
          <p className="dashboard-label">
            SMART CAMPUS
          </p>

          <h1>Referral Requests</h1>

          <p>
            Review and manage student referral requests.
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
          Loading referral requests...
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
            <h2>No Referral Requests</h2>

            <p>
              There are currently no referral requests.
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
                <strong>Student</strong>

                <p>
                  {referral.studentEmail}
                </p>
              </div>

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

            <div className="employee-referral-actions">

              <button
                className="accept-btn"
                onClick={() =>
                  updateStatus(
                    referral.id,
                    'ACCEPTED'
                  )
                }
                disabled={referral.status === 'ACCEPTED'}
              >
                Accept
              </button>

              <button
                className="reject-btn"
                onClick={() =>
                  updateStatus(
                    referral.id,
                    'REJECTED'
                  )
                }
                disabled={referral.status === 'REJECTED'}
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

export default EmployeeReferrals