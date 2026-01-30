import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getVendorVehicles } from '../../services/api'

export default function VendorDashboard() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState(null)
  
  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    try {
      setLoading(true)
      const response = await getVendorVehicles()
      setVehicles(response.data || [])
    } catch (err) {
      console.error('Error fetching vehicles:', err)
      if (err.response?.status === 403) {
        console.error('Access denied. Please make sure you are logged in as a vendor.')
        alert('Access denied. Please log out and log back in as a vendor user.')
      } else if (err.response?.status === 401) {
        console.error('Unauthorized. Please log in again.')
        alert('Your session has expired. Please log in again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const [recentBookings] = useState([
    {
      id: 'BK001',
      customer: 'Rajesh Kumar',
      carName: 'Maruti Swift',
      pickupDate: '2025-12-08',
      returnDate: '2025-12-10',
      status: 'Active',
      amount: 3500
    },
    {
      id: 'BK002',
      customer: 'Priya Singh',
      carName: 'Honda Accord',
      pickupDate: '2025-12-09',
      returnDate: '2025-12-11',
      status: 'Pending',
      amount: 5000
    },
    {
      id: 'BK003',
      customer: 'Amit Patel',
      carName: 'Mahindra XUV500',
      pickupDate: '2025-12-06',
      returnDate: '2025-12-08',
      status: 'Completed',
      amount: 7500
    },
    {
      id: 'BK004',
      customer: 'Neha Sharma',
      carName: 'Tata Nexon',
      pickupDate: '2025-12-07',
      returnDate: '2025-12-09',
      status: 'Completed',
      amount: 4500
    }
  ])

  // Calculate stats from vehicles
  const stats = {
    totalCars: vehicles.length,
    availableCars: vehicles.filter(v => v.status === 'AVAILABLE').length,
    rentedCars: vehicles.filter(v => v.status === 'BOOKED').length,
    maintenanceCars: vehicles.filter(v => v.status === 'UNDER_MAINTENANCE').length,
    activeBookings: 0, // Will be updated when booking module is integrated
    completedBookings: 0, // Will be updated when booking module is integrated
    totalEarnings: vehicles.reduce((sum, v) => sum + (v.pricePerDay || 0), 0),
    monthlyEarnings: 0, // Will be calculated from bookings
    averageRating: 4.8 // Placeholder until reviews are implemented
  }

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Active':
        return <span className="badge bg-primary">Active</span>
      case 'Pending':
        return <span className="badge bg-warning text-dark">Pending</span>
      case 'Completed':
        return <span className="badge bg-success">Completed</span>
      default:
        return <span className="badge bg-secondary">{status}</span>
    }
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-primary'
      case 'Pending': return 'bg-warning text-dark'
      case 'Confirmed': return 'bg-info'
      case 'Completed': return 'bg-success'
      case 'Cancelled': return 'bg-danger'
      default: return 'bg-secondary'
    }
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div>
      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-6 col-lg-3">
          <div className="vendor-stat-card">
            <div className="stat-icon primary">🚗</div>
            <div className="stat-content">
              <h6 className="stat-label">Total Cars</h6>
              <h3 className="stat-value">{stats.totalCars}</h3>
              <small className="stat-change text-info">{stats.availableCars} available</small>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="vendor-stat-card">
            <div className="stat-icon success">✓</div>
            <div className="stat-content">
              <h6 className="stat-label">Available</h6>
              <h3 className="stat-value">{stats.availableCars}</h3>
              <small className="stat-change text-success">Ready to rent</small>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="vendor-stat-card">
            <div className="stat-icon info">🚙</div>
            <div className="stat-content">
              <h6 className="stat-label">Rented</h6>
              <h3 className="stat-value">{stats.rentedCars}</h3>
              <small className="stat-change text-info">Currently rented</small>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="vendor-stat-card">
            <div className="stat-icon accent">💰</div>
            <div className="stat-content">
              <h6 className="stat-label">Total Value</h6>
              <h3 className="stat-value">₹{(stats.totalEarnings / 1000).toFixed(0)}K</h3>
              <small className="stat-change text-info">Daily rate total</small>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Overview */}
      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <div className="vendor-card">
            <div className="card-header">
              <h5 className="mb-0">Revenue Overview</h5>
              <small className="text-muted">Last 6 months</small>
            </div>
            <div className="card-body">
              <div className="revenue-chart-placeholder">
                <svg viewBox="0 0 400 200" className="chart-svg">
                  <rect x="40" y="150" width="30" height="30" fill="var(--primary-color)" rx="4"/>
                  <rect x="80" y="120" width="30" height="60" fill="var(--primary-color)" rx="4"/>
                  <rect x="120" y="90" width="30" height="90" fill="var(--primary-color)" rx="4"/>
                  <rect x="160" y="60" width="30" height="120" fill="var(--primary-color)" rx="4"/>
                  <rect x="200" y="40" width="30" height="140" fill="var(--accent-color)" rx="4"/>
                  <rect x="240" y="45" width="30" height="135" fill="var(--accent-color)" rx="4"/>
                </svg>
              </div>
              <div className="revenue-stats">
                <div className="revenue-stat-item">
                  <span>Total Earnings</span>
                  <strong>₹{stats.totalEarnings.toLocaleString()}</strong>
                </div>
                <div className="revenue-stat-item">
                  <span>Monthly Avg.</span>
                  <strong>₹{(stats.totalEarnings / 6).toLocaleString()}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="vendor-card">
            <div className="card-header">
              <h5 className="mb-0">Performance</h5>
            </div>
            <div className="card-body">
              <div className="performance-metric">
                <div className="metric-label">
                  <span>Rating</span>
                  <strong>{stats.averageRating} / 5.0</strong>
                </div>
                <div className="metric-bar">
                  <div 
                    className="metric-fill" 
                    style={{ width: `${(stats.averageRating / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
              <hr />
              <div className="performance-stats">
                <div className="perf-stat">
                  <span className="perf-label">Response Time</span>
                  <span className="perf-value">2.5 hrs</span>
                </div>
                <div className="perf-stat">
                  <span className="perf-label">Cancellation</span>
                  <span className="perf-value">2%</span>
                </div>
                <div className="perf-stat">
                  <span className="perf-label">Total Reviews</span>
                  <span className="perf-value">34</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="vendor-card">
        <div className="card-header">
          <h5 className="mb-0">Recent Bookings</h5>
          <Link to="/vendor/bookings" className="btn btn-sm btn-outline-primary">
            View All
          </Link>
        </div>
        <div className="table-responsive">
          <table className="vendor-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Customer</th>
                <th>Car</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map(booking => (
                <tr key={booking.id}>
                  <td>
                    <strong>{booking.id}</strong>
                  </td>
                  <td>{booking.customer}</td>
                  <td>{booking.carName}</td>
                  <td>
                    <small>
                      {booking.pickupDate} to {booking.returnDate}
                    </small>
                  </td>
                  <td>
                    {getStatusBadge(booking.status)}
                  </td>
                  <td>
                    <strong>₹{booking.amount.toLocaleString()}</strong>
                  </td>
                  <td>
                    <button 
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => setSelectedBooking(booking)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="vendor-modal-overlay" onClick={() => setSelectedBooking(null)}>
          <div className="vendor-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h5>Booking Details - {selectedBooking.id}</h5>
              <button 
                className="btn-close"
                onClick={() => setSelectedBooking(null)}
              ></button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h6 className="section-title">Customer Information</h6>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="label">Name:</span>
                    <span className="value">{selectedBooking.customer}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h6 className="section-title">Vehicle Information</h6>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="label">Car:</span>
                    <span className="value">{selectedBooking.carName}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h6 className="section-title">Booking Details</h6>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="label">Pickup Date:</span>
                    <span className="value">{selectedBooking.pickupDate}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Return Date:</span>
                    <span className="value">{selectedBooking.returnDate}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Duration:</span>
                    <span className="value">
                      {Math.ceil((new Date(selectedBooking.returnDate) - new Date(selectedBooking.pickupDate)) / (1000 * 60 * 60 * 24))} days
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Status:</span>
                    <span className={`badge ${getStatusColor(selectedBooking.status)}`}>
                      {selectedBooking.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h6 className="section-title">Payment Information</h6>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="label">Total Amount:</span>
                    <strong className="text-success">₹{selectedBooking.amount.toLocaleString()}</strong>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setSelectedBooking(null)}
              >
                Close
              </button>
              <Link 
                to="/vendor/bookings"
                className="btn btn-primary"
                onClick={() => setSelectedBooking(null)}
              >
                View Full Details
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
