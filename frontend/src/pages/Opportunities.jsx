import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Opportunities() {
  const [opportunities, setOpportunities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
const [typeFilter, setTypeFilter] = useState('')
const [locationFilter, setLocationFilter] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const token = localStorage.getItem('token')

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
  }, [])
const filteredOpportunities = useMemo(() => {
  return opportunities.filter((opportunity) => {
    const searchText = search.toLowerCase().trim()

    const matchesSearch =
      opportunity.title.toLowerCase().includes(searchText) ||
      opportunity.company.toLowerCase().includes(searchText) ||
      opportunity.skills.toLowerCase().includes(searchText)

    const matchesType =
      !typeFilter ||
      opportunity.type === typeFilter

    const matchesLocation =
      !locationFilter ||
      opportunity.location
        .toLowerCase()
        .includes(locationFilter.toLowerCase())

    return (
      matchesSearch &&
      matchesType &&
      matchesLocation
    )
  })
}, [
  opportunities,
  search,
  typeFilter,
  locationFilter,
])
  return (
    <div className="opportunities-page">

      <div className="page-header">
        <div>
          <p className="dashboard-label">
            SMART CAMPUS
          </p>

          <h1>Opportunities</h1>

          <p>
            Explore jobs, internships, and career opportunities.
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
          Loading opportunities...
        </p>
      )}

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}
      <div className="opportunity-filters">

  <input
    type="text"
    placeholder="Search by title, company, or skill..."
    value={search}
    onChange={(event) => setSearch(event.target.value)}
  />

  <select
    value={typeFilter}
    onChange={(event) => setTypeFilter(event.target.value)}
  >
    <option value="">All Types</option>
    <option value="Internship">Internship</option>
    <option value="Full Time">Full Time</option>
    <option value="Part Time">Part Time</option>
    <option value="Job">Job</option>
  </select>

  <input
    type="text"
    placeholder="Filter by location..."
    value={locationFilter}
    onChange={(event) =>
      setLocationFilter(event.target.value)
    }
  />

  <button
    className="clear-filter-btn"
    onClick={() => {
      setSearch('')
      setTypeFilter('')
      setLocationFilter('')
    }}
  >
    Clear Filters
  </button>

</div>

      {!loading && !error && opportunities.length === 0 && (
        <div className="empty-state">
          <h2>No Opportunities Available</h2>

          <p>
            There are currently no opportunities posted.
          </p>
        </div>
      )}

      <div className="opportunities-grid">
        {filteredOpportunities.map((opportunity) => (
          <div
            className="opportunity-card"
            key={opportunity.id}
          >
            <div className="opportunity-type">
              {opportunity.type}
            </div>

            <h2>{opportunity.title}</h2>

            <h3>{opportunity.company}</h3>

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

<div className="opportunity-actions">

  <button
    className="apply-btn"
    onClick={() =>
      navigate(`/applications/new/${opportunity.id}`)
    }
  >
    Apply Now
  </button>

  <button
    className="referral-btn"
    onClick={() =>
      navigate(`/referrals/new/${opportunity.id}`)
    }
  >
    Request Referral
  </button>

</div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default Opportunities