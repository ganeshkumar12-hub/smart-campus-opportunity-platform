import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function CreateOpportunity() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    location: '',
    type: '',
    skills: '',
    deadline: '',
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setLoading(true)

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
        'http://localhost:8080/api/opportunities',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            postedBy: email,
          }),
        }
      )

      if (!response.ok) {
        const message = await response.text()

        throw new Error(
          message || 'Failed to create opportunity'
        )
      }

      await response.json()

      navigate('/employee/opportunities')

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

        <h1>Create Opportunity</h1>

        <p className="application-subtitle">
          Post a new job, internship, or career opportunity.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="title">
              Title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Java Software Developer Intern"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="company">
              Company
            </label>

            <input
              id="company"
              name="company"
              type="text"
              value={formData.company}
              onChange={handleChange}
              placeholder="Smart Tech Solutions"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">
              Description
            </label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the opportunity..."
              rows="6"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">
              Location
            </label>

            <input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              placeholder="Bangalore"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="type">
              Opportunity Type
            </label>

            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="">
                Select type
              </option>

              <option value="Internship">
                Internship
              </option>

              <option value="Full Time">
                Full Time
              </option>

              <option value="Part Time">
                Part Time
              </option>

              <option value="Job">
                Job
              </option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="skills">
              Required Skills
            </label>

            <input
              id="skills"
              name="skills"
              type="text"
              value={formData.skills}
              onChange={handleChange}
              placeholder="Java, Spring Boot, MySQL"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="deadline">
              Application Deadline
            </label>

            <input
              id="deadline"
              name="deadline"
              type="date"
              value={formData.deadline}
              onChange={handleChange}
              required
            />
          </div>

          {error && (
            <p className="application-error">
              {error}
            </p>
          )}

          <div className="application-actions">

            <button
              type="button"
              className="back-btn"
              onClick={() =>
                navigate('/employee/opportunities')
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="apply-submit"
              disabled={loading}
            >
              {loading
                ? 'Creating...'
                : 'Create Opportunity'}
            </button>

          </div>

        </form>

      </div>

    </div>
  )
}

export default CreateOpportunity