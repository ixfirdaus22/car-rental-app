import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context'
import { login as apiLogin } from '../../services/api' // Import API

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { login: authLogin } = useAuth() 
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // 1. Call Backend
      const response = await apiLogin({ email, password })
      const data = response.data

      // 2. Save to Context
      authLogin(data)
      
      console.log('Login successful, user data:', data)
      console.log('User role:', data.role)

      // 3. Redirect based on Role (use setTimeout to ensure state is updated)
      setTimeout(() => {
        const role = data.role?.toUpperCase()
        console.log('Redirecting with role:', role)
        if (role === 'ADMIN') {
          navigate('/admin/dashboard', { replace: true })
        } else if (role === 'VENDOR') {
          navigate('/vendor/dashboard', { replace: true })
        } else {
          navigate('/', { replace: true }) // Customer
        }
      }, 100)

    } catch (err) {
      console.error('Login error:', err)
      setError(err.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <div className="card shadow p-5" style={{ maxWidth: '400px', width: '100%' }}>
          <h2 className="text-center mb-4">Login</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Email</label>
              <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label>Password</label>
              <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          
          <div className="text-center mt-3">
            <Link to="/register">Create an account</Link>
          </div>
      </div>
    </div>
  )
}