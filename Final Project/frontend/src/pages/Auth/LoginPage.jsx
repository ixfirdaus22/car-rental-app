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
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
      <div className="card shadow-lg border-0 overflow-hidden" style={{ maxWidth: '1000px', width: '100%', minHeight: '600px' }}>
        <div className="row g-0 h-100">
          {/* Left Side - Image & Branding */}
          <div className="col-lg-6 d-none d-lg-flex position-relative align-items-center justify-content-center bg-dark text-white">
            <img
              src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1000&q=80"
              alt="Luxury Car"
              className="position-absolute w-100 h-100"
              style={{ objectFit: 'cover', opacity: 0.6 }}
            />
            <div className="position-absolute w-100 h-100 bg-gradient-to-r from-black to-transparent" style={{ background: 'linear-gradient(45deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%)' }}></div>
            <div className="position-relative p-5 text-center">
              <h1 className="fw-bold mb-3">Welcome Back</h1>
              <p className="lead mb-4">Access your premium car rental dashboard and get back on the road.</p>
              <div className="d-flex justify-content-center gap-2">
                <span className="badge bg-light text-dark rounded-pill px-3 py-2">Premium Fleet</span>
                <span className="badge bg-light text-dark rounded-pill px-3 py-2">24/7 Support</span>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="col-lg-6 d-flex align-items-center bg-white">
            <div className="card-body p-5">
              <div className="mb-4 text-center text-lg-start">
                <h2 className="fw-bold text-primary mb-2">Sign In</h2>
                <p className="text-muted">Enter your credentials to continue</p>
              </div>

              {error && (
                <div className="alert alert-danger d-flex align-items-center" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  <div>{error}</div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="floatingInput"
                    placeholder="name@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                  <label htmlFor="floatingInput">Email Address</label>
                </div>

                <div className="form-floating mb-4">
                  <input
                    type="password"
                    className="form-control"
                    id="floatingPassword"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                  <label htmlFor="floatingPassword">Password</label>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="rememberMe" />
                    <label className="form-check-label text-muted small" htmlFor="rememberMe">
                      Remember me
                    </label>
                  </div>
                  <a href="#" className="text-primary small text-decoration-none">Forgot Password?</a>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 btn-lg mb-4 shadow-sm"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Logging in...
                    </>
                  ) : 'Sign In'}
                </button>

                <div className="text-center">
                  <p className="text-muted mb-0">
                    Don't have an account?{' '}
                    <Link to="/register" className="fw-bold text-primary text-decoration-none">
                      Create an account
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}