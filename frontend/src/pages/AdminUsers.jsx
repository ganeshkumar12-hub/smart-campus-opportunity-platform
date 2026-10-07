import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AdminUsers() {
  const navigate = useNavigate()

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')

  const getCurrentUserEmail = () => {
    const token = localStorage.getItem('token')

    if (!token) {
      return null
    }

    try {
      const payload = JSON.parse(
        atob(token.split('.')[1])
      )

      return payload.sub
    } catch {
      return null
    }
  }

  const currentUserEmail = getCurrentUserEmail()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token')

        if (!token) {
          navigate('/login')
          return
        }

        const response = await fetch(
          'http://localhost:8080/api/users',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!response.ok) {
          throw new Error('Failed to load users')
        }

        const data = await response.json()

        setUsers(data)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [navigate])

  const handleDelete = async (userId, userName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${userName}?`
    )

    if (!confirmed) {
      return
    }

    try {
      setDeletingId(userId)
      setError('')

      const token = localStorage.getItem('token')

      const response = await fetch(
        `http://localhost:8080/api/users/${userId}`,
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
          message || 'Failed to delete user'
        )
      }

      setUsers((previousUsers) =>
        previousUsers.filter(
          (user) => user.id !== userId
        )
      )
    } catch (error) {
      setError(error.message)
    } finally {
      setDeletingId(null)
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user.email
        .toLowerCase()
        .includes(searchTerm.toLowerCase())

    const matchesRole =
      roleFilter === 'ALL' ||
      user.role === roleFilter

    return matchesSearch && matchesRole
  })

  return (
    <div className="applications-page">

      <div className="page-header">
        <div>
          <p className="dashboard-label">
            SMART CAMPUS
          </p>

          <h1>Manage Users</h1>

          <p>
            View and manage students, employees and administrators.
          </p>
        </div>

        <button
          className="back-btn"
          onClick={() =>
            navigate('/admin/dashboard')
          }
        >
          Back to Dashboard
        </button>
      </div>

      {/* SEARCH AND ROLE FILTER */}

      <div className="user-filters">

        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
        />

        <select
          value={roleFilter}
          onChange={(e) =>
            setRoleFilter(e.target.value)
          }
        >
          <option value="ALL">
            All Roles
          </option>

          <option value="STUDENT">
            Students
          </option>

          <option value="EMPLOYEE">
            Employees
          </option>

          <option value="ADMIN">
            Admins
          </option>
        </select>

      </div>

      {loading && (
        <p className="status-message">
          Loading users...
        </p>
      )}

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      {!loading &&
        !error &&
        users.length === 0 && (
          <div className="empty-state">
            <h2>No Users Found</h2>

            <p>
              There are no users registered in the platform.
            </p>
          </div>
        )}

      {!loading &&
        !error &&
        users.length > 0 &&
        filteredUsers.length === 0 && (
          <div className="empty-state">
            <h2>No Matching Users</h2>

            <p>
              No users match your search or role filter.
            </p>
          </div>
        )}

      {!loading &&
        !error &&
        filteredUsers.length > 0 && (
          <div className="applications-grid">

            {filteredUsers.map((user) => {

              const isCurrentAdmin =
                user.email === currentUserEmail

              return (
                <div
                  className="application-item"
                  key={user.id}
                >

                  <div className="application-item-header">

                    <div>
                      <p className="application-number">
                        User #{user.id}
                      </p>

                      <h2>
                        {user.name}
                      </h2>
                    </div>

                    <span
                      className={`application-status ${user.role.toLowerCase()}`}
                    >
                      {isCurrentAdmin
                        ? 'CURRENT ADMIN'
                        : user.role}
                    </span>

                  </div>

                  <div className="application-info">

                    <div>
                      <strong>Email</strong>

                      <p>
                        {user.email}
                      </p>
                    </div>

                    <div>
                      <strong>Role</strong>

                      <p>
                        {user.role}
                      </p>
                    </div>

                  </div>

                  <div className="employee-application-actions">

                    {isCurrentAdmin ? (
                      <button
                        className="back-btn"
                        disabled
                      >
                        Current Admin
                      </button>
                    ) : (
                      <button
                        className="reject-btn"
                        onClick={() =>
                          handleDelete(
                            user.id,
                            user.name
                          )
                        }
                        disabled={
                          deletingId === user.id
                        }
                      >
                        {deletingId === user.id
                          ? 'Deleting...'
                          : 'Delete User'}
                      </button>
                    )}

                  </div>

                </div>
              )
            })}

          </div>
        )}

    </div>
  )
}

export default AdminUsers