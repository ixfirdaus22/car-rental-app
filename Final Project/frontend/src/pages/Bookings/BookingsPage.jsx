import { useState, useEffect } from 'react';
import { useAuth } from '../../context';
import { getUserBookings, cancelBooking, getBookingById } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function BookingsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('current');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Fetch bookings from backend
  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await getUserBookings();
      setBookings(response.data || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }
    try {
      await cancelBooking(bookingId);
      alert('Booking cancelled successfully!');
      fetchBookings(); // Refresh bookings
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking');
      console.error('Error cancelling booking:', err);
    }
  };

  const handleViewDetails = async (bookingId) => {
    try {
      setLoadingDetails(true);
      setSelectedBooking(bookingId);
      const response = await getBookingById(bookingId);
      setBookingDetails(response.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to load booking details');
      console.error('Error fetching booking details:', err);
      setSelectedBooking(null);
      setBookingDetails(null);
    } finally {
      setLoadingDetails(false);
    }
  };

  // Sample bookings data for demo (will be populated when user books a car)
  const sampleBookings = [
    {
      bookingId: 'BK001',
      carBrand: 'Maruti',
      carModel: 'Swift',
      carImage: 'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?auto=format&fit=crop&w=400&q=60',
      pickupLocation: 'Delhi',
      pickupDate: '2025-12-05',
      pickupTime: '10:00 AM',
      dropoffLocation: 'Delhi',
      dropoffDate: '2025-12-10',
      dropoffTime: '6:00 PM',
      totalDays: 5,
      costPerDay: 1500,
      totalCost: 7500,
      status: 'Confirmed',
      bookingDate: '2025-11-25'
    },
    {
      bookingId: 'BK002',
      carBrand: 'Honda',
      carModel: 'Accord',
      carImage: 'https://images.unsplash.com/photo-1606611013016-969c19d24e6f?auto=format&fit=crop&w=400&q=60',
      pickupLocation: 'Mumbai',
      pickupDate: '2025-12-15',
      pickupTime: '2:00 PM',
      dropoffLocation: 'Pune',
      dropoffDate: '2025-12-18',
      dropoffTime: '4:00 PM',
      totalDays: 3,
      costPerDay: 3500,
      totalCost: 10500,
      status: 'Pending',
      bookingDate: '2025-11-24'
    },
    {
      bookingId: 'BK003',
      carBrand: 'Mahindra',
      carModel: 'XUV500',
      carImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=400&q=60',
      pickupLocation: 'Bangalore',
      pickupDate: '2025-10-05',
      pickupTime: '9:00 AM',
      dropoffLocation: 'Bangalore',
      dropoffDate: '2025-10-12',
      dropoffTime: '5:00 PM',
      totalDays: 7,
      costPerDay: 4500,
      totalCost: 31500,
      status: 'Completed',
      bookingDate: '2025-09-20'
    },
    {
      bookingId: 'BK004',
      carBrand: 'Tata',
      carModel: 'Nexon',
      carImage: 'https://images.unsplash.com/photo-1606611013016-969c19d24e6f?auto=format&fit=crop&w=400&q=60',
      pickupLocation: 'Chennai',
      pickupDate: '2025-09-10',
      pickupTime: '8:00 AM',
      dropoffLocation: 'Chennai',
      dropoffDate: '2025-09-15',
      dropoffTime: '6:00 PM',
      totalDays: 5,
      costPerDay: 2500,
      totalCost: 12500,
      status: 'Completed',
      bookingDate: '2025-08-25'
    }
  ];

  // Helper function to get image path
  const getImagePath = (imageUrl) => {
    if (!imageUrl) return '/vehicle-images/Accord.jpg'; // Default image
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    if (imageUrl.includes('/')) {
      return imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
    }
    return `/vehicle-images/${imageUrl}`;
  };

  // Filter bookings based on status
  const currentBookings = bookings.filter(b => 
    b.status === 'CONFIRMED' || b.status === 'PENDING' || b.status === 'ACTIVE'
  );

  const pastBookings = bookings.filter(b => 
    b.status === 'COMPLETED' || b.status === 'CANCELLED'
  );

  const displayBookings = activeTab === 'current' ? currentBookings : pastBookings;

  const getStatusBadge = (status) => {
    switch(status) {
      case 'CONFIRMED':
        return <span className="badge bg-success">Confirmed</span>;
      case 'PENDING':
        return <span className="badge bg-warning text-dark">Pending</span>;
      case 'ACTIVE':
        return <span className="badge bg-primary">Active</span>;
      case 'COMPLETED':
        return <span className="badge bg-secondary">Completed</span>;
      case 'CANCELLED':
        return <span className="badge bg-danger">Cancelled</span>;
      default:
        return <span className="badge bg-light text-dark">{status}</span>;
    }
  };

  // Calculate days between dates
  const calculateDays = (pickupDate, returnDate) => {
    const pickup = new Date(pickupDate);
    const return_ = new Date(returnDate);
    const diffTime = Math.abs(return_ - pickup);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  if (!user) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning text-center">
          <h5>Please log in to view your bookings</h5>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4 fw-bold">My Bookings</h1>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4" role="tablist">
        <li className="nav-item" role="presentation">
          <button 
            className={`nav-link ${activeTab === 'current' ? 'active' : ''}`}
            onClick={() => setActiveTab('current')}
            type="button"
            role="tab"
            aria-selected={activeTab === 'current'}
          >
            Current Bookings ({currentBookings.length})
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button 
            className={`nav-link ${activeTab === 'past' ? 'active' : ''}`}
            onClick={() => setActiveTab('past')}
            type="button"
            role="tab"
            aria-selected={activeTab === 'past'}
          >
            Past Bookings ({pastBookings.length})
          </button>
        </li>
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
          {/* Bookings List */}
          {displayBookings.length === 0 ? (
            <div className="alert alert-info text-center py-5">
              <h5>No {activeTab === 'current' ? 'current' : 'past'} bookings</h5>
              <p className="mb-0">You haven't made any {activeTab === 'current' ? 'current' : 'past'} bookings yet.</p>
            </div>
          ) : (
            <div className="row g-4">
              {displayBookings.map(booking => {
                const days = calculateDays(booking.pickupDate, booking.returnDate);
                return (
                  <div key={booking.id} className="col-lg-6">
                    <div className="card h-100 shadow-sm booking-card">
                      <div className="row g-0 h-100">
                        {/* Car Image */}
                        <div className="col-md-4">
                          <img
                            src={getImagePath(booking.vehicleImageUrl)}
                            alt={`${booking.vehicleMake} ${booking.vehicleModel}`}
                            className="img-fluid h-100"
                            style={{ objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.src = '/vehicle-images/Accord.jpg';
                            }}
                          />
                        </div>

                        {/* Booking Details */}
                        <div className="col-md-8">
                          <div className="card-body">
                            {/* Header */}
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <div>
                                <h5 className="card-title mb-0">
                                  {booking.vehicleMake} {booking.vehicleModel}
                                </h5>
                                <small className="text-muted">Booking ID: #{booking.id}</small>
                              </div>
                              {getStatusBadge(booking.status)}
                            </div>

                            <hr className="my-2" />

                            {/* Booking Details Grid */}
                            <div className="row g-2 mb-3 small">
                              <div className="col-6">
                                <strong>Pick-up:</strong>
                                <div className="text-muted">
                                  {booking.pickupLocation}<br />
                                  {new Date(booking.pickupDate).toLocaleDateString()}
                                </div>
                              </div>
                              <div className="col-6">
                                <strong>Drop-off:</strong>
                                <div className="text-muted">
                                  {booking.returnLocation}<br />
                                  {new Date(booking.returnDate).toLocaleDateString()}
                                </div>
                              </div>
                            </div>

                            {/* Rental Duration */}
                            <div className="mb-3 small">
                              <strong>Duration:</strong>
                              <span className="ms-2 text-muted">{days} day{days !== 1 ? 's' : ''}</span>
                            </div>

                            {/* Cost Breakdown */}
                            <div className="bg-light p-2 rounded mb-3 small">
                              <div className="d-flex justify-content-between mb-1">
                                <span>₹{booking.vehiclePricePerDay} × {days} day{days !== 1 ? 's' : ''}</span>
                                <span>₹{(booking.vehiclePricePerDay * days).toLocaleString()}</span>
                              </div>
                              <div className="d-flex justify-content-between fw-bold border-top pt-1">
                                <span>Total Cost:</span>
                                <span>₹{booking.totalAmount.toLocaleString()}</span>
                              </div>
                            </div>

                            {/* Booking Date */}
                            <div className="text-muted small">
                              Booked on: {new Date(booking.createdAt).toLocaleDateString()}
                            </div>

                            {/* Action Buttons */}
                              {(booking.status === 'CONFIRMED' || booking.status === 'PENDING' || booking.status === 'ACTIVE') && (
                                <div className="d-flex gap-2 mt-3">
                                  <button 
                                    className="btn btn-sm btn-outline-primary flex-grow-1"
                                    onClick={() => handleViewDetails(booking.id)}
                                  >
                                    View Details
                                  </button>
                                  {booking.status !== 'CANCELLED' && (
                                    <button 
                                      className="btn btn-sm btn-outline-danger flex-grow-1"
                                      onClick={() => handleCancelBooking(booking.id)}
                                    >
                                      Cancel
                                    </button>
                                  )}
                                </div>
                              )}
                            {booking.status === 'PENDING' && (
                              <div className="alert alert-warning my-3 py-1 px-2 small mb-0">
                                ⏳ Awaiting confirmation. Please complete the payment.
                              </div>
                            )}
                            {booking.status === 'COMPLETED' && (
                              <div className="d-flex gap-2 mt-3">
                                <button className="btn btn-sm btn-outline-secondary flex-grow-1">
                                  View Receipt
                                </button>
                                <button className="btn btn-sm btn-outline-primary flex-grow-1">
                                  Rate & Review
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div 
          className="modal fade show" 
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => {
            setSelectedBooking(null);
            setBookingDetails(null);
          }}
        >
          <div 
            className="modal-dialog modal-lg modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Booking Details #{selectedBooking}</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => {
                    setSelectedBooking(null);
                    setBookingDetails(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                {loadingDetails ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Loading booking details...</p>
                  </div>
                ) : bookingDetails ? (
                  <div>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <h6 className="text-muted">Vehicle Information</h6>
                        <p className="mb-1"><strong>Make:</strong> {bookingDetails.vehicleMake}</p>
                        <p className="mb-1"><strong>Model:</strong> {bookingDetails.vehicleModel}</p>
                        <p className="mb-1"><strong>Year:</strong> {bookingDetails.vehicleYear}</p>
                        <p className="mb-1"><strong>License Plate:</strong> {bookingDetails.vehicleLicensePlate}</p>
                        <p className="mb-1"><strong>Price per Day:</strong> ₹{bookingDetails.vehiclePricePerDay}</p>
                      </div>
                      <div className="col-md-6">
                        <h6 className="text-muted">Booking Information</h6>
                        <p className="mb-1"><strong>Status:</strong> {getStatusBadge(bookingDetails.status)}</p>
                        <p className="mb-1"><strong>Pickup Date:</strong> {new Date(bookingDetails.pickupDate).toLocaleDateString()}</p>
                        <p className="mb-1"><strong>Return Date:</strong> {new Date(bookingDetails.returnDate).toLocaleDateString()}</p>
                        <p className="mb-1"><strong>Pickup Location:</strong> {bookingDetails.pickupLocation}</p>
                        <p className="mb-1"><strong>Return Location:</strong> {bookingDetails.returnLocation}</p>
                        <p className="mb-1"><strong>Total Amount:</strong> ₹{bookingDetails.totalAmount}</p>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <h6 className="text-muted">Customer Information</h6>
                        <p className="mb-1"><strong>Name:</strong> {bookingDetails.userName}</p>
                        <p className="mb-1"><strong>Email:</strong> {bookingDetails.userEmail}</p>
                      </div>
                    </div>
                    <div className="row mt-3">
                      <div className="col-12">
                        <h6 className="text-muted">Vendor Information</h6>
                        <p className="mb-1"><strong>Vendor Name:</strong> {bookingDetails.vendorName}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="alert alert-danger">
                    Failed to load booking details. Please try again.
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => {
                    setSelectedBooking(null);
                    setBookingDetails(null);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
