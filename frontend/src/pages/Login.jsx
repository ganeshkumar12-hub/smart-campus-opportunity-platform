import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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

      navigate('/dashboard')
    } catch (error) {
      setError(error.message)
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
            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <p className="login-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="login-submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login