import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function ApplicationForm() {
  const { opportunityId } = useParams()
  const navigate = useNavigate()

  const [resumeFile, setResumeFile] = useState(null)
  const [coverLetter, setCoverLetter] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleFileChange = (event) => {
    const file = event.target.files[0]

    setError('')
    setSuccess('')

    if (!file) {
      setResumeFile(null)
      return
    }

    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed')
      setResumeFile(null)
      event.target.value = ''
      return
    }

    setResumeFile(file)
  }

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

      if (!resumeFile) {
        throw new Error('Please select your resume PDF')
      }

      /*
       * STEP 1:
       * Upload the resume PDF
       */
      const formData = new FormData()

      formData.append('file', resumeFile)

      const uploadResponse = await fetch(
        'http://localhost:8080/api/resumes/upload',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      )

      if (!uploadResponse.ok) {
        const message = await uploadResponse.text()

        throw new Error(
          message || 'Failed to upload resume'
        )
      }

      /*
       * Backend returns something like:
       * /uploads/resumes/xxxxx.pdf
       */
      const uploadedResumePath =
        await uploadResponse.text()

      /*
       * Convert the relative backend path
       * into a complete URL.
       */
      const resumeUrl =
        `http://localhost:8080${uploadedResumePath}`

      /*
       * STEP 2:
       * Submit the application
       */
      const applicationResponse = await fetch(
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

      if (!applicationResponse.ok) {
        const message =
          await applicationResponse.text()

        throw new Error(
          message || 'Failed to submit application'
        )
      }

      const application =
        await applicationResponse.json()

      setSuccess(
        `Application submitted successfully. Status: ${application.status}`
      )

      setResumeFile(null)
      setCoverLetter('')

      /*
       * Clear the file input.
       */
      document.getElementById('resumeFile').value = ''

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

            <label htmlFor="resumeFile">
              Resume PDF
            </label>

            <input
              id="resumeFile"
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              required
            />

            {resumeFile && (
              <p className="file-selected">
                Selected: {resumeFile.name}
              </p>
            )}

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
              onClick={() =>
                navigate('/opportunities')
              }
              disabled={loading}
            >
              Back
            </button>

            <button
              type="submit"
              className="apply-submit"
              disabled={loading}
            >
              {loading
                ? 'Uploading & Submitting...'
                : 'Submit Application'}
            </button>

          </div>

        </form>

      </div>

    </div>
  )
}

export default ApplicationForm