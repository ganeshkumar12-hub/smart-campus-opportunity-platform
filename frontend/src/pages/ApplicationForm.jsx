import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function ApplicationForm() {
  const { opportunityId } = useParams()
  const navigate = useNavigate()

  const [resumeUrl, setResumeUrl] = useState('')
  const [coverLetter, setCoverLetter] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const token = localStorage.getItem('token')

      if (!token) {
        navigate('/login')
        return
      }

      const response = await fetch(
        'http://localhost:8080/api/applications',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            opportunityId: Number(opportunityId),
            resumeUrl,
            coverLetter,
          }),
        }
      )

      if (!response.ok) {
        const message = await response.text()
        throw new Error(message || 'Failed to submit application')
      }

      const application = await response.json()

      setSuccess(
        `Application submitted successfully. Status: ${application.status}`
      )

      setResumeUrl('')
      setCoverLetter('')
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="application-page">

      <div className="application-card">

        <p className="dashboard-label">
          SMART CAMPUS
        </p>

        <h1>Apply for Opportunity</h1>

        <p className="application-subtitle">
          Submit your resume and cover letter for this opportunity.
        </p>

        <div className="opportunity-id">
          Opportunity ID: {opportunityId}
        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="resumeUrl">
              Resume URL
            </label>

            <input
              id="resumeUrl"
              type="url"
              value={resumeUrl}
              onChange={(event) =>
                setResumeUrl(event.target.value)
              }
              placeholder="https://example.com/resume.pdf"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="coverLetter">
              Cover Letter
            </label>

            <textarea
              id="coverLetter"
              value={coverLetter}
              onChange={(event) =>
                setCoverLetter(event.target.value)
              }
              placeholder="Write your cover letter..."
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
              onClick={() => navigate('/opportunities')}
            >
              Back
            </button>

            <button
              type="submit"
              className="apply-submit"
              disabled={loading}
            >
              {loading
                ? 'Submitting...'
                : 'Submit Application'}
            </button>

          </div>

        </form>

      </div>

    </div>
  )
}

export default ApplicationForm