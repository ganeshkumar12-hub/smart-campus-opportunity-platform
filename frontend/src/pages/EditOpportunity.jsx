import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function EditOpportunity() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    description: '',
    location: '',
    type: '',
    skills: '',
    deadline: '',
    postedBy: '',
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOpportunity = async () => {
      try {
        const token = localStorage.getItem('token')

        if (!token) {
          navigate('/login')
          return
        }

        const response = await fetch(
          `http://localhost:8080/api/opportunities/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!response.ok) {
          throw new Error('Failed to load opportunity')
        }

        const data = await response.json()

        setFormData({
          title: data.title || '',
          company: data.company || '',
          description: data.description || '',
          location: data.location || '',
          type: data.type || '',
          skills: data.skills || '',
          deadline: data.deadline || '',
          postedBy: data.postedBy || '',
        })
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOpportunity()
  }, [id, navigate])

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
    setSaving(true)

    try {
      const token = localStorage.getItem('token')

      if (!token) {
        navigate('/login')
        return
      }

      const response = await fetch(
        `http://localhost:8080/api/opportunities/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      )

      if (!response.ok) {
        const message = await response.text()

        throw new Error(
          message || 'Failed to update opportunity'
        )
      }

      await response.json()

      navigate('/employee/opportunities')
    } catch (error) {
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="application-page">
        <div className="application-card">
          <p className="status-message">
            Loading opportunity...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="application-page">

      <div className="application-card">

        <p className="dashboard-label">
          SMART CAMPUS
        </p>

        <h1>Edit Opportunity</h1>

        <p className="application-subtitle">
          Update the details of this opportunity.
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
              disabled={saving}
            >
              {saving
                ? 'Saving...'
                : 'Save Changes'}
            </button>

          </div>

        </form>

      </div>

    </div>
  )
}

export default EditOpportunity