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
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
      <div className="card shadow-lg border-0 overflow-hidden" style={{ maxWidth: '1200px', width: '100%', minHeight: '800px' }}>
        <div className="row g-0 h-100">
          {/* Left Side - Image & Branding */}
          <div className="col-lg-5 d-none d-lg-flex position-relative align-items-center justify-content-center bg-dark text-white">
            <img
              src="https://images.unsplash.com/photo-1503376763036-066120622c74?auto=format&fit=crop&w=800&q=80"
              alt="Premium Car"
              className="position-absolute w-100 h-100"
              style={{ objectFit: 'cover', opacity: 0.6 }}
            />
            <div className="position-absolute w-100 h-100 bg-gradient-to-r from-black to-transparent" style={{ background: 'linear-gradient(45deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%)' }}></div>
            <div className="position-relative p-5 text-center">
              <h2 className="fw-bold mb-3 display-6">Join Our Community</h2>
              <p className="lead mb-4">Start your journey with the most premium car rental service in the country.</p>
              <ul className="list-unstyled text-start d-inline-block">
                <li className="mb-2"><span className="me-2">✓</span> Wide Range of Vehicles</li>
                <li className="mb-2"><span className="me-2">✓</span> Transparent Pricing</li>
                <li className="mb-2"><span className="me-2">✓</span> Easy Booking Process</li>
                <li className="mb-2"><span className="me-2">✓</span> 24/7 Roadside Assistance</li>
              </ul>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="col-lg-7 bg-white">
            <div className="card-body p-5 h-100 overflow-auto">
              <div className="mb-4">
                <h2 className="fw-bold text-primary mb-1">Create Account</h2>
                <p className="text-muted">Register today to start booking</p>
              </div>

              {error && <div className="alert alert-danger shadow-sm">{error}</div>}

              {/* User Type Toggle */}
              <div className="d-flex justify-content-center mb-4">
                <div className="bg-light p-1 rounded-pill d-inline-flex border">
                  <button
                    type="button"
                    className={`btn btn-sm rounded-pill px-4 ${userType === 'CUSTOMER' ? 'btn-primary shadow-sm' : 'text-muted'}`}
                    onClick={() => setUserType('CUSTOMER')}
                  >
                    Customer
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm rounded-pill px-4 ${userType === 'VENDOR' ? 'btn-primary shadow-sm' : 'text-muted'}`}
                    onClick={() => setUserType('VENDOR')}
                  >
                    Vendor
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <h5 className="mb-3 text-secondary border-bottom pb-2">Personal Information</h5>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input name="name" className="form-control" id="floatingName" placeholder="John Doe" onChange={handleChange} required />
                      <label htmlFor="floatingName">Full Name</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input name="email" type="email" className="form-control" id="floatingEmail" placeholder="name@example.com" onChange={handleChange} required />
                      <label htmlFor="floatingEmail">Email Address</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input name="phoneNo" className="form-control" id="floatingPhone" placeholder="1234567890" onChange={handleChange} required />
                      <label htmlFor="floatingPhone">Phone Number</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating">
                      <select name="gender" className="form-select" id="floatingGender" onChange={handleChange}>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                      </select>
                      <label htmlFor="floatingGender">Gender</label>
                    </div>
                  </div>
                </div>

                <h5 className="mb-3 text-secondary border-bottom pb-2">Identity Details</h5>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input name="aadharNo" className="form-control" id="floatingAadhar" placeholder="Aadhar" onChange={handleChange} required />
                      <label htmlFor="floatingAadhar">Aadhar Number</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input name="licenseNo" className="form-control" id="floatingLicense" placeholder="License" onChange={handleChange} required />
                      <label htmlFor="floatingLicense">Driving License No</label>
                    </div>
                  </div>
                </div>

                <h5 className="mb-3 text-secondary border-bottom pb-2">Address</h5>
                <div className="row g-3 mb-4">
                  <div className="col-md-4">
                    <div className="form-floating">
                      <input name="houseNo" className="form-control" id="floatingHouse" placeholder="No" onChange={handleChange} required />
                      <label htmlFor="floatingHouse">House No</label>
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="form-floating">
                      <input name="buildingName" className="form-control" id="floatingBuilding" placeholder="Building" onChange={handleChange} required />
                      <label htmlFor="floatingBuilding">Building Name</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input name="streetName" className="form-control" id="floatingStreet" placeholder="Street" onChange={handleChange} required />
                      <label htmlFor="floatingStreet">Street Name</label>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-floating">
                      <input name="area" className="form-control" id="floatingArea" placeholder="Area" onChange={handleChange} required />
                      <label htmlFor="floatingArea">Area</label>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-floating">
                      <input name="pincode" className="form-control" id="floatingPincode" placeholder="Pin" onChange={handleChange} required />
                      <label htmlFor="floatingPincode">Pincode</label>
                    </div>
                  </div>
                </div>

                <h5 className="mb-3 text-secondary border-bottom pb-2">Security</h5>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input name="password" type="password" className="form-control" id="floatingPass" placeholder="Password" onChange={handleChange} required />
                      <label htmlFor="floatingPass">Password</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input name="confirmPassword" type="password" className="form-control" id="floatingConfirm" placeholder="Confirm" onChange={handleChange} required />
                      <label htmlFor="floatingConfirm">Confirm Password</label>
                    </div>
                  </div>
                </div>

                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary btn-lg shadow-sm" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creating Account...
                      </>
                    ) : 'Create Account'}
                  </button>
                </div>
              </form>
              <div className="text-center mt-3">
                <p className="text-muted">
                  Already have an account? <Link to="/login" className="fw-bold text-decoration-none">Login</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}