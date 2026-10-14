import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate()

  const handleLogin = async (event) => {
    event.preventDefault()
    setError('')

    try {
      const response = await fetch(
        `http://localhost:8080/api/auth/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
        {
          method: 'POST',
        }
      )

      if (!response.ok) {
        throw new Error('Invalid email or password')
      }

      const token = await response.text()
      localStorage.setItem('token', token)

      const payload = JSON.parse(atob(token.split('.')[1]))
      const role = payload.role

      if (role === 'STUDENT') {
        navigate('/dashboard')
      } else if (role === 'EMPLOYEE') {
        navigate('/employee/dashboard')
      } else if (role === 'ADMIN') {
        navigate('/admin/dashboard')
      } else {
        setError('Unknown user role')
      }
    } catch (error) {
      setError(error.message || 'Login failed')
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Welcome Back</h1>

        <p className="login-subtitle">
          Login to your Smart Campus account
        </p>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="login-submit">
            Login
          </button>
        </form>

        <p className="register-login-link">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  )
}

export default Login