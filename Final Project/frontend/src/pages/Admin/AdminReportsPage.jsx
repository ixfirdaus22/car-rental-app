import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getRevenueReport, getBookingAnalytics, getVehiclePerformance, getUserAnalytics } from '../../services/api';

const COLORS = ['#0d6efd', '#198754', '#ffc107', '#0dcaf0', '#dc3545', '#6f42c1'];

export default function AdminReportsPage() {
  const [period, setPeriod] = useState('year');
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [vehicleData, setVehicleData] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetchAllReports();
  }, [period]);

  const fetchAllReports = async () => {
    try {
      setLoading(true);
      const [revenueRes, bookingRes, vehicleRes, userRes] = await Promise.all([
        getRevenueReport(period),
        getBookingAnalytics(),
        getVehiclePerformance(),
        getUserAnalytics()
      ]);

      setRevenueData(revenueRes.data);
      setBookingData(bookingRes.data);
      setVehicleData(vehicleRes.data);
      setUserData(userRes.data);
    } catch (err) {
      console.error('Error fetching reports:', err);
      if (err.response?.status === 403) {
        alert('Access denied. Please make sure you are logged in as an admin.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Format revenue data for charts
  const revenueChartData = revenueData?.monthlyBreakdown?.map(item => ({
    month: item.month.substring(0, 3),
    revenue: item.revenue || 0,
    bookings: item.bookingCount || 0
  })) || [];

  // Format booking data for charts
  const bookingChartData = bookingData?.monthlyBookings?.map(item => ({
    month: item.month.substring(0, 3),
    bookings: item.count || 0
  })) || [];

  // Booking status pie chart data
  const bookingStatusData = bookingData?.bookingsByStatus ? Object.entries(bookingData.bookingsByStatus).map(([name, value]) => ({
    name,
    value
  })) : [];

  // Top vehicles data
  const topVehiclesData = vehicleData?.topVehicles?.slice(0, 5) || [];

  // User role distribution
  const userRoleData = userData?.usersByRole ? Object.entries(userData.usersByRole).map(([name, value]) => ({
    name,
    value
  })) : [];

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading reports...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="fw-bold mb-0">📈 Reports & Analytics</h1>
        <div>
          <button
            className={`btn me-2 ${period === 'month' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setPeriod('month')}
          >
            Month
          </button>
          <button
            className={`btn ${period === 'year' ? 'btn-primary' : 'btn-outline-secondary'}`}
            onClick={() => setPeriod('year')}
          >
            Year
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted mb-2">Total Revenue</h6>
              <h3 className="fw-bold text-success mb-0">
                ₹{revenueData?.totalRevenue?.toLocaleString('en-IN', { maximumFractionDigits: 0 }) || '0'}
              </h3>
              <small className="text-muted">All time</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted mb-2">Total Bookings</h6>
              <h3 className="fw-bold text-primary mb-0">{bookingData?.totalBookings || 0}</h3>
              <small className="text-muted">All time</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted mb-2">Total Vehicles</h6>
              <h3 className="fw-bold text-info mb-0">{vehicleData?.totalVehicles || 0}</h3>
              <small className="text-muted">Active fleet</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted mb-2">Total Users</h6>
              <h3 className="fw-bold text-warning mb-0">{userData?.totalUsers || 0}</h3>
              <small className="text-muted">Registered users</small>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Overview */}
      <div className="row g-4 mb-4">
        <div className="col-md-8">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold">Revenue Overview</h5>
            </div>
            <div className="card-body">
              <div className="d-flex align-items-end mb-4 gap-3">
                <h2 className="mb-0 fw-bold text-success">
                  ₹{period === 'month' 
                    ? revenueData?.monthlyRevenue?.toLocaleString('en-IN', { maximumFractionDigits: 0 }) || '0'
                    : revenueData?.yearlyRevenue?.toLocaleString('en-IN', { maximumFractionDigits: 0 }) || '0'}
                </h2>
                <span className="text-muted">
                  {period === 'month' ? 'This Month' : 'This Year'}
                </span>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#198754" strokeWidth={2} name="Revenue" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold">Revenue by Status</h5>
            </div>
            <div className="card-body">
              {revenueData?.revenueByStatus && (
                <div>
                  {Object.entries(revenueData.revenueByStatus).map(([status, amount]) => (
                    <div key={status} className="d-flex justify-content-between mb-2">
                      <span className="text-muted">{status}</span>
                      <strong>₹{amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</strong>
                    </div>
                  ))}
                </div>
              )}
              <hr />
              <div className="d-flex justify-content-between">
                <span className="text-muted">Avg Booking Value</span>
                <strong>₹{revenueData?.averageBookingValue?.toLocaleString('en-IN', { maximumFractionDigits: 0 }) || '0'}</strong>
              </div>
              <div className="d-flex justify-content-between mt-2">
                <span className="text-muted">Total Transactions</span>
                <strong>{revenueData?.totalTransactions || 0}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Analytics */}
      <div className="row g-4 mb-4">
        <div className="col-md-8">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold">Booking Trends</h5>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={bookingChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="bookings" fill="#0d6efd" name="Bookings" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold">Booking Status</h5>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={bookingStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {bookingStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Stats */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm border-0">
            <div className="card-body text-center">
              <h6 className="text-muted mb-2">Pending</h6>
              <h4 className="fw-bold text-warning mb-0">{bookingData?.pendingBookings || 0}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0">
            <div className="card-body text-center">
              <h6 className="text-muted mb-2">Confirmed</h6>
              <h4 className="fw-bold text-info mb-0">{bookingData?.confirmedBookings || 0}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0">
            <div className="card-body text-center">
              <h6 className="text-muted mb-2">Completed</h6>
              <h4 className="fw-bold text-success mb-0">{bookingData?.completedBookings || 0}</h4>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card shadow-sm border-0">
            <div className="card-body text-center">
              <h6 className="text-muted mb-2">Cancelled</h6>
              <h4 className="fw-bold text-danger mb-0">{bookingData?.cancelledBookings || 0}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Top Vehicles */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-white py-3">
          <h5 className="mb-0 fw-bold">Top Performing Vehicles</h5>
        </div>
        <div className="card-body">
          {topVehiclesData.length > 0 ? (
            <div className="row g-4">
              {topVehiclesData.map((vehicle, index) => (
                <div key={vehicle.vehicleId} className="col-md-6">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="fw-bold">{vehicle.make} {vehicle.model}</span>
                    <small className="text-muted">{vehicle.bookingCount} bookings</small>
                  </div>
                  <div className="progress mb-2" style={{ height: '8px' }}>
                    <div
                      className="progress-bar"
                      style={{
                        width: `${Math.min((vehicle.bookingCount / (topVehiclesData[0]?.bookingCount || 1)) * 100, 100)}%`,
                        backgroundColor: COLORS[index % COLORS.length]
                      }}
                    ></div>
                  </div>
                  <div className="d-flex justify-content-between">
                    <small className="text-success fw-bold">
                      ₹{vehicle.totalRevenue?.toLocaleString('en-IN', { maximumFractionDigits: 0 }) || '0'} Revenue
                    </small>
                    {vehicle.averageRating > 0 && (
                      <small className="text-warning">
                        ⭐ {vehicle.averageRating.toFixed(1)}
                      </small>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted text-center">No vehicle data available</p>
          )}
        </div>
      </div>

      {/* User Analytics */}
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold">User Distribution</h5>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={userRoleData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {userRoleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold">User Statistics</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Active Users</span>
                  <strong>{userData?.activeUsers || 0}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">New Users (This Month)</span>
                  <strong>{userData?.newUsersThisMonth || 0}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Avg Bookings/User</span>
                  <strong>{userData?.averageBookingsPerUser?.toFixed(2) || '0.00'}</strong>
                </div>
              </div>
              <hr />
              <h6 className="mb-3">Top Customers</h6>
              {userData?.topCustomers?.slice(0, 5).map((customer, index) => (
                <div key={customer.userId} className="d-flex justify-content-between mb-2">
                  <div>
                    <strong>{customer.userName}</strong>
                    <br />
                    <small className="text-muted">{customer.bookingCount} bookings</small>
                  </div>
                  <strong className="text-success">
                    ₹{customer.totalSpent?.toLocaleString('en-IN', { maximumFractionDigits: 0 }) || '0'}
                  </strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
