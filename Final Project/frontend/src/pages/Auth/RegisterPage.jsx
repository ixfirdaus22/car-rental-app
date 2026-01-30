import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signup } from '../../services/api' // Import from api.js

export default function RegisterPage() {
  const [userType, setUserType] = useState('CUSTOMER')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()


  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNo: '',
    password: '',
    confirmPassword: '',

    // Identity & Address (From ER Diagram)
    licenseNo: '',
    aadharNo: '',
    houseNo: '',
    buildingName: '',
    streetName: '',
    area: '',
    pincode: '',
    gender: 'MALE'
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    // Combine form data with selected Role
    const payload = { ...formData, role: userType }

    setLoading(true)
    try {
      await signup(payload) // Calls /api/auth/register
      alert("Registration Successful! Please Login.")
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-5">
      <div className="card shadow mx-auto" style={{ maxWidth: '800px' }}>
        <div className="card-body p-4">
          <h2 className="text-center fw-bold">Create Account</h2>
          {error && <div className="alert alert-danger">{error}</div>}

          {/* User Type Toggle */}
          <div className="text-center mb-4">
            <div className="btn-group">
              <button type="button" className={`btn ${userType === 'CUSTOMER' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setUserType('CUSTOMER')}>Customer</button>
              <button type="button" className={`btn ${userType === 'VENDOR' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setUserType('VENDOR')}>Vendor</button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              {/* Personal Info */}
              <div className="col-md-6"><label>Full Name</label><input name="name" className="form-control" onChange={handleChange} required /></div>
              <div className="col-md-6"><label>Email</label><input name="email" type="email" className="form-control" onChange={handleChange} required /></div>
              <div className="col-md-6"><label>Phone</label><input name="phoneNo" className="form-control" onChange={handleChange} required /></div>
              <div className="col-md-6"><label>Gender</label>
                <select name="gender" className="form-select" onChange={handleChange}>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              {/* Identity */}
              <div className="col-md-6"><label>Aadhar No</label><input name="aadharNo" className="form-control" onChange={handleChange} required /></div>
              <div className="col-md-6"><label>License No</label><input name="licenseNo" className="form-control" onChange={handleChange} required /></div>

              {/* Address */}
              <div className="col-md-4"><label>House No</label><input name="houseNo" className="form-control" onChange={handleChange} required /></div>
              <div className="col-md-8"><label>Building Name</label><input name="buildingName" className="form-control" onChange={handleChange} required /></div>
              <div className="col-md-6"><label>Street</label><input name="streetName" className="form-control" onChange={handleChange} required /></div>
              <div className="col-md-3"><label>Area</label><input name="area" className="form-control" onChange={handleChange} required /></div>
              <div className="col-md-3"><label>Pincode</label><input name="pincode" className="form-control" onChange={handleChange} required /></div>

              {/* Password */}
              <div className="col-md-6"><label>Password</label><input name="password" type="password" className="form-control" onChange={handleChange} required /></div>
              <div className="col-md-6"><label>Confirm Password</label><input name="confirmPassword" type="password" className="form-control" onChange={handleChange} required /></div>
            </div>

            <button type="submit" className="btn btn-primary w-100 mt-4" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
          <div className="text-center mt-3"><Link to="/login">Already have an account? Login</Link></div>
        </div>
      </div>
    </div>
  )
}