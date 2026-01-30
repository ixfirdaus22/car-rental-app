import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllBookings } from '../../services/api';

export default function AdminBookingsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await getAllBookings();
      setBookings(response.data || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      if (err.response?.status === 403) {
        alert('Access denied. Please make sure you are logged in as an admin.');
      } else if (err.response?.status === 401) {
        alert('Your session has expired. Please log in again.');
        navigate('/login');
      }
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = activeTab === 'All'
    ? bookings
    : bookings.filter(b => b.status === activeTab);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETED': return <span className="badge bg-success">Completed</span>;
      case 'PENDING': return <span className="badge bg-warning text-dark">Pending</span>;
      case 'CONFIRMED': return <span className="badge bg-info">Confirmed</span>;
      case 'ACTIVE': return <span className="badge bg-primary">Active</span>;
      case 'CANCELLED': return <span className="badge bg-danger">Cancelled</span>;
      default: return <span className="badge bg-secondary">{status}</span>;
    }
  };

  const calculateDays = (pickupDate, returnDate) => {
    const pickup = new Date(pickupDate);
    const return_ = new Date(returnDate);
    const diffTime = Math.abs(return_ - pickup);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
  };

  return (
    <div>
      <h1 className="fw-bold mb-4">📋 Manage Bookings</h1>

      {/* Status Tabs */}
      <ul className="nav nav-tabs mb-4">
        {['All', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'ACTIVE'].map(tab => (
          <li className="nav-item" key={tab}>
            <button
              className={`nav-link ${activeTab === tab ? 'active fw-bold' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'PENDING' ? 'Pending' : 
               tab === 'CONFIRMED' ? 'Confirmed' : 
               tab === 'COMPLETED' ? 'Completed' : 
               tab === 'CANCELLED' ? 'Cancelled' : 
               tab === 'ACTIVE' ? 'Active' : tab}
              {tab !== 'All' && (
                <span className="badge bg-secondary ms-2">
                  {bookings.filter(b => b.status === tab).length}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

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
          {/* Bookings Table */}
          <div className="card shadow-sm border-0">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0 align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Booking ID</th>
                      <th>Customer</th>
                      <th>Car Details</th>
                      <th>Dates</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center py-5">
                          <p className="text-muted mb-0">No bookings found in this category.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map(booking => {
                        const days = calculateDays(booking.pickupDate, booking.returnDate);
                        return (
                          <tr key={booking.id}>
                            <td><strong>#{booking.id}</strong></td>
                            <td>
                              <div>
                                <strong>{booking.userName || 'Unknown'}</strong>
                                <br />
                                <small className="text-muted">{booking.userEmail || ''}</small>
                              </div>
                            </td>
                            <td>
                              <div>
                                <strong>{booking.vehicleMake} {booking.vehicleModel}</strong>
                                <br />
                                <small className="text-muted">{booking.vehicleYear} • {booking.vehicleLicensePlate}</small>
                              </div>
                            </td>
                            <td>
                              <small className="d-block text-muted">From: {new Date(booking.pickupDate).toLocaleDateString()}</small>
                              <small className="d-block text-muted">To: {new Date(booking.returnDate).toLocaleDateString()}</small>
                              <small className="text-muted">({days} day{days !== 1 ? 's' : ''})</small>
                            </td>
                            <td><strong>₹{booking.totalAmount?.toLocaleString() || '0'}</strong></td>
                            <td>{getStatusBadge(booking.status)}</td>
                            <td>
                              <button 
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => handleViewDetails(booking)}
                              >
                                View Details
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
          </div>
        </>
      )}

      {/* Booking Details Modal */}
      {showModal && selectedBooking && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Booking Details - #{selectedBooking.id}</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <h6 className="text-muted mb-3">Customer Information</h6>
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <th>Name:</th>
                          <td>{selectedBooking.userName || 'Unknown'}</td>
                        </tr>
                        <tr>
                          <th>Email:</th>
                          <td>{selectedBooking.userEmail || 'N/A'}</td>
                        </tr>
                        <tr>
                          <th>User ID:</th>
                          <td>#{selectedBooking.userId}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="col-md-6 mb-3">
                    <h6 className="text-muted mb-3">Vehicle Information</h6>
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <th>Vehicle:</th>
                          <td>{selectedBooking.vehicleMake} {selectedBooking.vehicleModel}</td>
                        </tr>
                        <tr>
                          <th>Year:</th>
                          <td>{selectedBooking.vehicleYear}</td>
                        </tr>
                        <tr>
                          <th>License Plate:</th>
                          <td>{selectedBooking.vehicleLicensePlate || 'N/A'}</td>
                        </tr>
                        <tr>
                          <th>Price Per Day:</th>
                          <td>₹{selectedBooking.vehiclePricePerDay || '0'}</td>
                        </tr>
                        <tr>
                          <th>Vendor:</th>
                          <td>{selectedBooking.vendorName || 'Unknown'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <hr />

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <h6 className="text-muted mb-3">Booking Information</h6>
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <th>Booking ID:</th>
                          <td><strong>#{selectedBooking.id}</strong></td>
                        </tr>
                        <tr>
                          <th>Pickup Date:</th>
                          <td>{new Date(selectedBooking.pickupDate).toLocaleDateString()}</td>
                        </tr>
                        <tr>
                          <th>Return Date:</th>
                          <td>{new Date(selectedBooking.returnDate).toLocaleDateString()}</td>
                        </tr>
                        <tr>
                          <th>Duration:</th>
                          <td>{calculateDays(selectedBooking.pickupDate, selectedBooking.returnDate)} day{calculateDays(selectedBooking.pickupDate, selectedBooking.returnDate) !== 1 ? 's' : ''}</td>
                        </tr>
                        <tr>
                          <th>Pickup Location:</th>
                          <td>{selectedBooking.pickupLocation || 'N/A'}</td>
                        </tr>
                        <tr>
                          <th>Return Location:</th>
                          <td>{selectedBooking.returnLocation || 'N/A'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="col-md-6 mb-3">
                    <h6 className="text-muted mb-3">Payment & Status</h6>
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <th>Total Amount:</th>
                          <td className="text-primary fw-bold">₹{selectedBooking.totalAmount?.toLocaleString() || '0'}</td>
                        </tr>
                        <tr>
                          <th>Status:</th>
                          <td>{getStatusBadge(selectedBooking.status)}</td>
                        </tr>
                        <tr>
                          <th>Created At:</th>
                          <td>{new Date(selectedBooking.createdAt).toLocaleString()}</td>
                        </tr>
                        <tr>
                          <th>Last Updated:</th>
                          <td>{new Date(selectedBooking.updatedAt).toLocaleString()}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
