import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context'
import { useEffect } from 'react'

export default function VendorLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Redirect to login if not authenticated or not a vendor
  useEffect(() => {
    if (!user) {
      console.log('VendorLayout: No user found, redirecting to login')
      navigate('/login')
      return
    }
    
    const userRole = user.role?.toUpperCase()
    console.log('VendorLayout: User role:', userRole, 'User:', user)
    
    if (userRole !== 'VENDOR') {
      console.log('VendorLayout: User is not a vendor, redirecting to login')
      navigate('/login')
    }
  }, [user, navigate])

  if (!user || user.role?.toUpperCase() !== 'VENDOR') {
    return null
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navItems = [
    { label: 'Dashboard', path: '/vendor/dashboard', icon: '📊' },
    { label: 'My Cars', path: '/vendor/cars', icon: '🚗' },
    { label: 'Bookings', path: '/vendor/bookings', icon: '📅' },
    { label: 'Revenue', path: '/vendor/revenue', icon: '💰' },
    { label: 'Settings', path: '/vendor/settings', icon: '⚙️' }
  ]

  return (
    <div className="d-flex min-vh-100">
      {/* Sidebar */}
      <nav className="vendor-sidebar">
        <div className="vendor-sidebar-header">
          <h5 className="mb-0">
            <span className="text-primary">Rent</span>YourCar
          </h5>
          <p className="text-muted small mb-0">Vendor Portal</p>
        </div>

        <div className="vendor-sidebar-profile">
          <div className="vendor-avatar">
            {(user.name || user.fullName)?.charAt(0).toUpperCase()}
          </div>
          <div className="vendor-profile-info">
            <p className="mb-0 fw-bold small">{user.name || user.fullName}</p>
            <small className="text-muted">{user.email}</small>
          </div>
        </div>

        <ul className="vendor-nav-menu">
          {navItems.map(item => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`vendor-nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="vendor-sidebar-footer">
          <Link to="/profile" className="vendor-nav-link">
            <span className="nav-icon">👤</span>
            <span className="nav-label">My Profile</span>
          </Link>
          <button
            onClick={handleLogout}
            className="vendor-nav-link btn-logout"
          >
            <span className="nav-icon">🚪</span>
            <span className="nav-label">Logout</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="vendor-main-content">
        <div className="vendor-topbar">
          <div className="vendor-topbar-left">
            <h2 className="mb-0">Welcome, {(user.name || user.fullName)?.split(' ')[0]}! 👋</h2>
          </div>
          <div className="vendor-topbar-right">
            <span className="vendor-status-badge">🟢 Online</span>
          </div>
        </div>

        <div className="vendor-content-area">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
