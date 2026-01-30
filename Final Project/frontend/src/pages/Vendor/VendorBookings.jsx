import { useState, useEffect } from 'react'
import { getVendorBookings } from '../../services/api'

export default function VendorBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [originalBookings] = useState([
    {
      id: 'BK001',
      customer: 'Rajesh Kumar',
      email: 'rajesh@example.com',
      phone: '+91 98765 43210',
      carName: 'Maruti Swift',
      carId: 'CAR001',
      pickupDate: '2025-12-08',
      returnDate: '2025-12-10',
      pickupLocation: 'Mumbai Central',
      returnLocation: 'Mumbai Central',
      status: 'Active',
      amount: 3500,
      days: 2,
      rating: 5
    },
    {
      id: 'BK002',
      customer: 'Priya Singh',
      email: 'priya@example.com',
      phone: '+91 98765 43211',
      carName: 'Honda Accord',
      carId: 'CAR002',
      pickupDate: '2025-12-09',
      returnDate: '2025-12-11',
      pickupLocation: 'Mumbai Airport',
      returnLocation: 'Mumbai Central',
      status: 'Pending',
      amount: 5000,
      days: 2,
      rating: null
    },
    {
      id: 'BK003',
      customer: 'Amit Patel',
      email: 'amit@example.com',
      phone: '+91 98765 43212',
      carName: 'Mahindra XUV500',
      carId: 'CAR003',
      pickupDate: '2025-12-06',
      returnDate: '2025-12-08',
      pickupLocation: 'Mumbai Central',
      returnLocation: 'Mumbai Central',
      status: 'Completed',
      amount: 7500,
      days: 2,
      rating: 4.5
    },
    {
      id: 'BK004',
      customer: 'Neha Sharma',
      email: 'neha@example.com',
      phone: '+91 98765 43213',
      carName: 'Tata Nexon',
      carId: 'CAR004',
      pickupDate: '2025-12-07',
      returnDate: '2025-12-09',
      pickupLocation: 'Mumbai Airport',
      returnLocation: 'Mumbai Airport',
      status: 'Completed',
      amount: 4500,
      days: 2,
      rating: 4
    },
    {
      id: 'BK005',
      customer: 'Vikas Reddy',
      email: 'vikas@example.com',
      phone: '+91 98765 43214',
      carName: 'Maruti Swift',
      carId: 'CAR001',
      pickupDate: '2025-12-05',
      returnDate: '2025-12-07',
      pickupLocation: 'Mumbai Central',
      returnLocation: 'Pune',
      status: 'Cancelled',
      amount: 2500,
      days: 2,
      rating: null
    },
    {
      id: 'BK006',
      customer: 'Sneha Desai',
      email: 'sneha@example.com',
      phone: '+91 98765 43215',
      carName: 'Honda Accord',
      carId: 'CAR002',
      pickupDate: '2025-12-10',
      returnDate: '2025-12-13',
      pickupLocation: 'Mumbai Central',
      returnLocation: 'Mumbai Central',
      status: 'Confirmed',
      amount: 6500,
      days: 3,
      rating: null
    }
  ])

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response = await getVendorBookings()
      setBookings(response.data || [])
    } catch (err) {
      console.error('Error fetching vendor bookings:', err)
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  const [filteredStatus, setFilteredStatus] = useState('All')
  const [selectedBooking, setSelectedBooking] = useState(null)

  const statuses = ['All', 'PENDING', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED']

  const filteredBookings = filteredStatus === 'All' 
    ? bookings 
    : bookings.filter(b => b.status === filteredStatus)

  // Helper to map backend status to display status
  const getDisplayStatus = (status) => {
    const statusMap = {
      'PENDING': 'Pending',
      'CONFIRMED': 'Confirmed',
      'ACTIVE': 'Active',
      'COMPLETED': 'Completed',
      'CANCELLED': 'Cancelled'
    }
    return statusMap[status] || status
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'ACTIVE': return 'bg-primary'
      case 'PENDING': return 'bg-warning text-dark'
      case 'CONFIRMED': return 'bg-info'
      case 'COMPLETED': return 'bg-success'
      case 'CANCELLED': return 'bg-danger'
      default: return 'bg-secondary'
    }
  }

  const renderRating = (rating) => {
    if (!rating) return <small className="text-muted">Not rated</small>
    return (
      <div>
        <span className="text-warning">★</span> {rating}/5
      </div>
    )
  }

  return (
    <div>
      <h4 className="mb-4">Bookings Management</h4>

      {/* Filters */}
      <div className="vendor-filters mb-4">
        <div className="filter-group">
          {statuses.map(status => (
            <button
              key={status}
              className={`filter-btn ${filteredStatus === status ? 'active' : ''}`}
              onClick={() => setFilteredStatus(status)}
            >
              {status}
              <span className="filter-count">
                {status === 'All' 
                  ? bookings.length 
                  : bookings.filter(b => b.status === status).length
                }
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading bookings...</p>
        </div>
      ) : (
        <>
          {/* Bookings Grid */}
          <div className="row g-3 mb-4">
            {filteredBookings.length === 0 ? (
              <div className="col-12">
                <div className="alert alert-info text-center">
                  <p className="mb-0">No bookings found.</p>
                </div>
              </div>
            ) : (
              filteredBookings.map(booking => {
                const days = Math.ceil((new Date(booking.returnDate) - new Date(booking.pickupDate)) / (1000 * 60 * 60 * 24)) || 1;
                return (
                  <div key={booking.id} className="col-md-6 col-lg-4">
                    <div className="vendor-booking-card">
                      <div className="booking-card-header">
                        <div className="booking-id-status">
                          <span className="booking-id">#{booking.id}</span>
                          <span className={`badge ${getStatusColor(booking.status)}`}>
                            {getDisplayStatus(booking.status)}
                          </span>
                        </div>
                      </div>

                      <div className="booking-card-body">
                        <div className="booking-customer">
                          <div className="customer-avatar">
                            {booking.userName?.charAt(0) || 'U'}
                          </div>
                          <div className="customer-info">
                            <p className="customer-name mb-0">{booking.userName || 'Unknown'}</p>
                            <small className="text-muted">{booking.userEmail || ''}</small>
                          </div>
                        </div>

                        <div className="booking-details">
                          <div className="detail-row">
                            <span className="detail-label">Car:</span>
                            <strong>{booking.vehicleMake} {booking.vehicleModel}</strong>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Period:</span>
                            <span>{days} day{days !== 1 ? 's' : ''}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Dates:</span>
                            <span className="date-range">
                              {new Date(booking.pickupDate).toLocaleDateString()} to {new Date(booking.returnDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Amount:</span>
                            <strong className="text-success">₹{booking.totalAmount?.toLocaleString() || '0'}</strong>
                          </div>
                        </div>
                      </div>

                      <div className="booking-card-footer">
                        <button 
                          className="btn btn-sm btn-primary"
                          onClick={() => setSelectedBooking(booking)}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {/* Bookings Table View */}
      <div className="vendor-card">
        <div className="card-header">
          <h5 className="mb-0">All Bookings</h5>
        </div>
        <div className="table-responsive">
          <table className="vendor-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Car</th>
                <th>Dates</th>
                <th>Days</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    <p className="text-muted mb-0">No bookings found.</p>
                  </td>
                </tr>
              ) : (
                filteredBookings.map(booking => {
                  const days = Math.ceil((new Date(booking.returnDate) - new Date(booking.pickupDate)) / (1000 * 60 * 60 * 24)) || 1;
                  return (
                    <tr key={booking.id}>
                      <td><strong>#{booking.id}</strong></td>
                      <td>
                        <div>
                          <p className="mb-0 fw-500">{booking.userName || 'Unknown'}</p>
                          <small className="text-muted">{booking.userEmail || ''}</small>
                        </div>
                      </td>
                      <td>{booking.vehicleMake} {booking.vehicleModel}</td>
                      <td>
                        <small>
                          {new Date(booking.pickupDate).toLocaleDateString()} <br/> {new Date(booking.returnDate).toLocaleDateString()}
                        </small>
                      </td>
                      <td><strong>{days}</strong></td>
                      <td><strong>₹{booking.totalAmount?.toLocaleString() || '0'}</strong></td>
                      <td>
                        <span className={`badge ${getStatusColor(booking.status)}`}>
                          {getDisplayStatus(booking.status)}
                        </span>
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
                  );
                })
              )}
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
                    <span className="value">{selectedBooking.userName || 'Unknown'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Email:</span>
                    <span className="value">{selectedBooking.userEmail || ''}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h6 className="section-title">Vehicle Information</h6>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="label">Car:</span>
                    <span className="value">{selectedBooking.vehicleMake} {selectedBooking.vehicleModel}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Car ID:</span>
                    <span className="value">#{selectedBooking.vehicleId}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">License Plate:</span>
                    <span className="value">{selectedBooking.vehicleLicensePlate || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h6 className="section-title">Booking Details</h6>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="label">Pickup Date:</span>
                    <span className="value">{new Date(selectedBooking.pickupDate).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Return Date:</span>
                    <span className="value">{new Date(selectedBooking.returnDate).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Duration:</span>
                    <span className="value">
                      {Math.ceil((new Date(selectedBooking.returnDate) - new Date(selectedBooking.pickupDate)) / (1000 * 60 * 60 * 24)) || 1} days
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Pickup Location:</span>
                    <span className="value">{selectedBooking.pickupLocation}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Return Location:</span>
                    <span className="value">{selectedBooking.returnLocation}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Status:</span>
                    <span className={`badge ${getStatusColor(selectedBooking.status)}`}>
                      {getDisplayStatus(selectedBooking.status)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h6 className="section-title">Payment Information</h6>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="label">Total Amount:</span>
                    <strong className="text-success">₹{selectedBooking.totalAmount?.toLocaleString() || '0'}</strong>
                  </div>
                  <div className="detail-item">
                    <span className="label">Amount per Day:</span>
                    <span className="value">₹{selectedBooking.vehiclePricePerDay?.toLocaleString() || '0'}</span>
                  </div>
                </div>
              </div>

              {selectedBooking.rating && (
                <div className="detail-section">
                  <h6 className="section-title">Customer Feedback</h6>
                  <div className="feedback-box">
                    <p className="mb-2">
                      <strong>Rating:</strong> ⭐ {selectedBooking.rating}/5
                    </p>
                    <p className="text-muted">Great service! Will book again.</p>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setSelectedBooking(null)}
              >
                Close
              </button>
              {selectedBooking.status === 'Pending' && (
                <>
                  <button className="btn btn-danger">Reject</button>
                  <button className="btn btn-success">Confirm</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
