import { useState } from 'react'

export default function VendorRevenue() {
  const [revenueData] = useState([
    { month: 'July', revenue: 28500, bookings: 12, avgRating: 4.5 },
    { month: 'August', revenue: 35200, bookings: 15, avgRating: 4.6 },
    { month: 'September', revenue: 42000, bookings: 18, avgRating: 4.7 },
    { month: 'October', revenue: 38500, bookings: 16, avgRating: 4.8 },
    { month: 'November', revenue: 45000, bookings: 20, avgRating: 4.9 },
    { month: 'December', revenue: 35000, bookings: 8, avgRating: 4.8 }
  ])

  const [selectedMonth, setSelectedMonth] = useState('December')

  const totalRevenue = revenueData.reduce((sum, m) => sum + m.revenue, 0)
  const totalBookings = revenueData.reduce((sum, m) => sum + m.bookings, 0)
  const avgRevenue = (totalRevenue / revenueData.length).toFixed(0)

  const selectedMonthData = revenueData.find(m => m.month === selectedMonth)

  return (
    <div>
      <h4 className="mb-4">Revenue Management</h4>

      {/* Overall Stats */}
      <div className="row g-4 mb-4">
        <div className="col-md-6 col-lg-3">
          <div className="vendor-stat-card">
            <div className="stat-icon primary">💰</div>
            <div className="stat-content">
              <h6 className="stat-label">Total Revenue</h6>
              <h3 className="stat-value">₹{(totalRevenue / 100000).toFixed(2)}L</h3>
              <small className="stat-change text-success">+12% from last year</small>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="vendor-stat-card">
            <div className="stat-icon info">📊</div>
            <div className="stat-content">
              <h6 className="stat-label">Avg Monthly</h6>
              <h3 className="stat-value">₹{(avgRevenue / 1000).toFixed(0)}K</h3>
              <small className="stat-change">This period</small>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="vendor-stat-card">
            <div className="stat-icon success">📈</div>
            <div className="stat-content">
              <h6 className="stat-label">Total Bookings</h6>
              <h3 className="stat-value">{totalBookings}</h3>
              <small className="stat-change">6 months</small>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="vendor-stat-card">
            <div className="stat-icon accent">⭐</div>
            <div className="stat-content">
              <h6 className="stat-label">Avg Rating</h6>
              <h3 className="stat-value">4.7/5</h3>
              <small className="stat-change text-success">+0.2 improvement</small>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="vendor-card mb-4">
        <div className="card-header">
          <h5 className="mb-0">Revenue Trend (Last 6 Months)</h5>
        </div>
        <div className="card-body">
          <div className="revenue-chart-container">
            <div className="chart-bars">
              {revenueData.map((data, idx) => (
                <div key={idx} className="chart-bar-wrapper">
                  <div 
                    className="chart-bar"
                    style={{ 
                      height: `${(data.revenue / 45000) * 250}px`,
                      opacity: selectedMonth === data.month ? 1 : 0.6
                    }}
                    onClick={() => setSelectedMonth(data.month)}
                  >
                    <div className="bar-value">₹{(data.revenue / 1000).toFixed(0)}K</div>
                  </div>
                  <div className="chart-month">{data.month.slice(0, 3)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Month Details */}
      {selectedMonthData && (
        <div className="row g-4 mb-4">
          <div className="col-md-6">
            <div className="vendor-card">
              <div className="card-header">
                <h6 className="mb-0">{selectedMonth} Details</h6>
              </div>
              <div className="card-body">
                <div className="detail-row-large mb-3">
                  <span>Total Revenue</span>
                  <strong className="text-success">₹{selectedMonthData.revenue.toLocaleString()}</strong>
                </div>
                <div className="detail-row-large mb-3">
                  <span>Total Bookings</span>
                  <strong>{selectedMonthData.bookings}</strong>
                </div>
                <div className="detail-row-large mb-3">
                  <span>Average Per Booking</span>
                  <strong>₹{(selectedMonthData.revenue / selectedMonthData.bookings).toLocaleString()}</strong>
                </div>
                <div className="detail-row-large">
                  <span>Average Rating</span>
                  <strong>⭐ {selectedMonthData.avgRating}/5</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="vendor-card">
              <div className="card-header">
                <h6 className="mb-0">Performance Breakdown</h6>
              </div>
              <div className="card-body">
                <div className="performance-metric">
                  <div className="metric-label">
                    <span>Revenue Growth</span>
                    <strong>+8.5%</strong>
                  </div>
                  <div className="metric-bar">
                    <div className="metric-fill success" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <hr />
                <div className="performance-metric">
                  <div className="metric-label">
                    <span>Booking Fulfillment</span>
                    <strong>95%</strong>
                  </div>
                  <div className="metric-bar">
                    <div className="metric-fill primary" style={{ width: '95%' }}></div>
                  </div>
                </div>
                <hr />
                <div className="performance-metric">
                  <div className="metric-label">
                    <span>Customer Satisfaction</span>
                    <strong>94%</strong>
                  </div>
                  <div className="metric-bar">
                    <div className="metric-fill accent" style={{ width: '94%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transaction History */}
      <div className="vendor-card">
        <div className="card-header">
          <h5 className="mb-0">Recent Transactions</h5>
          <select className="form-select form-select-sm" style={{ maxWidth: '150px' }}>
            <option>All Months</option>
            <option>July</option>
            <option>August</option>
            <option>September</option>
            <option>October</option>
            <option>November</option>
            <option>December</option>
          </select>
        </div>
        <div className="table-responsive">
          <table className="vendor-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Booking ID</th>
                <th>Customer</th>
                <th>Car</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { tid: 'TXN001', bid: 'BK006', cust: 'Sneha Desai', car: 'Honda Accord', amt: 6500, date: '2025-12-09', status: 'Pending' },
                { tid: 'TXN002', bid: 'BK005', cust: 'Vikas Reddy', car: 'Maruti Swift', amt: 2500, date: '2025-12-05', status: 'Refunded' },
                { tid: 'TXN003', bid: 'BK004', cust: 'Neha Sharma', car: 'Tata Nexon', amt: 4500, date: '2025-12-09', status: 'Completed' },
                { tid: 'TXN004', bid: 'BK003', cust: 'Amit Patel', car: 'Mahindra XUV500', amt: 7500, date: '2025-12-08', status: 'Completed' },
                { tid: 'TXN005', bid: 'BK002', cust: 'Priya Singh', car: 'Honda Accord', amt: 5000, date: '2025-12-09', status: 'Pending' },
                { tid: 'TXN006', bid: 'BK001', cust: 'Rajesh Kumar', car: 'Maruti Swift', amt: 3500, date: '2025-12-10', status: 'Completed' }
              ].map(txn => (
                <tr key={txn.tid}>
                  <td><strong>{txn.tid}</strong></td>
                  <td>{txn.bid}</td>
                  <td>{txn.cust}</td>
                  <td>{txn.car}</td>
                  <td><strong>₹{txn.amt.toLocaleString()}</strong></td>
                  <td>{txn.date}</td>
                  <td>
                    <span className={`badge ${
                      txn.status === 'Completed' ? 'bg-success' : 
                      txn.status === 'Pending' ? 'bg-warning text-dark' : 
                      'bg-danger'
                    }`}>
                      {txn.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
