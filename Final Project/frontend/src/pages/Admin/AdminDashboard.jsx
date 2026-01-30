import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminStats, getAllBookings, getPendingUsers } from '../../services/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVehicles: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0,
    completedBookings: 0,
    activeVehicles: 0,
    bookedVehicles: 0
  });

  const [recentBookings, setRecentBookings] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats
      const statsResponse = await getAdminStats();
      if (statsResponse.data) {
        setStats(statsResponse.data);
      }

      // Fetch recent bookings
      const bookingsResponse = await getAllBookings();
      if (bookingsResponse.data) {
        // Get last 5 bookings, sorted by creation date (newest first)
        const sortedBookings = bookingsResponse.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        setRecentBookings(sortedBookings);
      }

      // Fetch pending users
      const pendingUsersResponse = await getPendingUsers();
      if (pendingUsersResponse.data) {
        setPendingUsers(pendingUsersResponse.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      if (err.response?.status === 403) {
        alert('Access denied. Please make sure you are logged in as an admin.');
      } else if (err.response?.status === 401) {
        alert('Your session has expired. Please log in again.');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="badge bg-success">Completed</span>;
      case 'PENDING':
        return <span className="badge bg-warning text-dark">Pending</span>;
      case 'CONFIRMED':
        return <span className="badge bg-info">Confirmed</span>;
      case 'ACTIVE':
        return <span className="badge bg-primary">Active</span>;
      case 'CANCELLED':
        return <span className="badge bg-danger">Cancelled</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  // Helper function to get image path
  const getImagePath = (imageUrl) => {
    if (!imageUrl) return '/vehicle-images/Accord.jpg';
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    if (imageUrl.includes('/')) {
      return imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
    }
    return `/vehicle-images/${imageUrl}`;
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-4 fw-bold">📊 Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted mb-2">Total Users</h6>
              <h2 className="fw-bold text-primary mb-0">{stats.totalUsers || 0}</h2>
              <small className="text-muted">All registered users</small>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted mb-2">Total Vehicles</h6>
              <h2 className="fw-bold text-info mb-0">{stats.totalVehicles || 0}</h2>
              <small className="text-success">{stats.activeVehicles || 0} available</small>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted mb-2">Total Bookings</h6>
              <h2 className="fw-bold text-warning mb-0">{stats.totalBookings || 0}</h2>
              <small className="text-info">{stats.pendingBookings || 0} pending</small>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted mb-2">Total Revenue</h6>
              <h2 className="fw-bold text-success mb-0">₹{stats.totalRevenue ? (stats.totalRevenue / 1000).toFixed(1) + 'K' : '0'}</h2>
              <small className="text-muted">From completed payments</small>
            </div>
          </div>
        </div>
      </div>

      {/* New User Registrations */}
      {pendingUsers.length > 0 && (
        <div className="card shadow-sm border-0 mb-4 border-warning">
          <div className="card-header bg-warning text-dark">
            <h5 className="mb-0 fw-bold">⚠️ New User Registrations ({pendingUsers.length})</h5>
          </div>
          <div className="card-body">
            <p className="mb-3">You have {pendingUsers.length} pending user registration{pendingUsers.length !== 1 ? 's' : ''} awaiting approval.</p>
            <button 
              className="btn btn-warning"
              onClick={() => navigate('/admin/users/registration-requests')}
            >
              View Registration Requests →
            </button>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                {pendingUsers.length > 0 && (
                  <button 
                    className="btn btn-outline-warning text-start fw-bold"
                    onClick={() => navigate('/admin/users/registration-requests')}
                  >
                    📝 Review New User Registrations ({pendingUsers.length})
                  </button>
                )}
                <button 
                  className="btn btn-outline-dark text-start"
                  onClick={() => navigate('/admin/cars')}
                >
                  🚗 Manage Vehicles
                </button>
                <button 
                  className="btn btn-outline-dark text-start"
                  onClick={() => navigate('/admin/bookings')}
                >
                  📋 View All Bookings
                </button>
                <button 
                  className="btn btn-outline-dark text-start"
                  onClick={() => navigate('/admin/users')}
                >
                  👥 Manage Users
                </button>
                <button 
                  className="btn btn-outline-dark text-start"
                  onClick={() => navigate('/admin/reports')}
                >
                  📊 Generate Reports
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">Statistics Summary</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <small>Completed Bookings</small>
                  <strong>{stats.completedBookings || 0}</strong>
                </div>
                <div className="progress">
                  <div 
                    className="progress-bar bg-success" 
                    style={{ width: stats.totalBookings > 0 ? `${(stats.completedBookings / stats.totalBookings) * 100}%` : '0%' }}
                  ></div>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <small>Pending Bookings</small>
                  <strong>{stats.pendingBookings || 0}</strong>
                </div>
                <div className="progress">
                  <div 
                    className="progress-bar bg-warning" 
                    style={{ width: stats.totalBookings > 0 ? `${(stats.pendingBookings / stats.totalBookings) * 100}%` : '0%' }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="d-flex justify-content-between mb-1">
                  <small>Vehicle Utilization</small>
                  <strong>{stats.totalVehicles > 0 ? Math.round((stats.bookedVehicles / stats.totalVehicles) * 100) : 0}%</strong>
                </div>
                <div className="progress">
                  <div 
                    className="progress-bar bg-info" 
                    style={{ width: stats.totalVehicles > 0 ? `${(stats.bookedVehicles / stats.totalVehicles) * 100}%` : '0%' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-light text-dark border-bottom">
          <h5 className="mb-0 fw-bold">📋 Recent Bookings</h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Booking ID</th>
                  <th>Customer</th>
                  <th>Car</th>
                  <th>Booking Date</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      <p className="text-muted mb-0">No bookings found.</p>
                    </td>
                  </tr>
                ) : (
                  recentBookings.map(booking => (
                    <tr key={booking.id}>
                      <td><strong>#{booking.id}</strong></td>
                      <td>{booking.userName || 'Unknown'}</td>
                      <td>{booking.vehicleMake} {booking.vehicleModel}</td>
                      <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
                      <td>{getStatusBadge(booking.status)}</td>
                      <td><strong>₹{booking.totalAmount?.toLocaleString() || '0'}</strong></td>
                      <td>
                        <button 
                          className="btn btn-sm btn-outline-dark"
                          onClick={() => navigate('/admin/bookings')}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
