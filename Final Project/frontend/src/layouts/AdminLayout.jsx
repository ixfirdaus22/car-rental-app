import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context";

export default function AdminLayout() {
  //get user info and logout function from custom hook
  const { user, logout } = useAuth();
  //get the navigation tool to change pages
  const navigate = useNavigate();

  //switch to toggle sidebar
  const [sidebarOpen, setSidebarOpen] = useState(true);

  //Security Check
  if (!user || user.role?.toUpperCase() !== 'ADMIN') {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    if (logout) logout();
    navigate('/login');
  };

  return (
    <div className="min-vh-100 bg-light">
      {/* Sidebar */}
      <nav
        className="bg-light border-end shadow-sm"
        style={{
          width: sidebarOpen ? '250px' : '0px',
          overflow: 'hidden',
          transition: 'width 0.3s ease',
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          zIndex: 1000,
        }}
      >
        <div className="d-flex flex-column h-100" style={{ width: '250px', padding: '1rem' }}>
          <div className="mb-4">
            <h5 className="fw-bold mb-0 text-dark">Admin Panel</h5>
            <small className="text-muted">RentYourCar</small>
          </div>
          <hr />

          <ul className="nav flex-column gap-2 flex-grow-1 overflow-auto hide-scrollbar">
            <li className="nav-item">
              <Link to="/admin/dashboard" className="nav-link text-dark">
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/cars" className="nav-link text-dark">
                Manage Cars
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/bookings" className="nav-link text-dark">
                Bookings
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/users" className="nav-link text-dark">
                Users
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/reviews" className="nav-link text-dark">
                Reviews
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/complaints" className="nav-link text-dark">
                Complaints
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/reports" className="nav-link text-dark">
                Reports
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/settings" className="nav-link text-dark">
                Settings
              </Link>
            </li>
          </ul>

          <hr className="mt-auto" />
          <div className="p-1">
            <button
              className="btn btn-danger btn-sm w-100"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div
        className="d-flex flex-column min-vh-100"
        style={{
          marginLeft: sidebarOpen ? '250px' : '0px',
          transition: 'margin-left 0.3s ease',
        }}
      >
        {/* {Header Bar} */}
        <header className="bg-white border-bottom p-3 d-flex justify-content-between align-items-center sticky-top">
          {/* {Toggle Sidebar Button} */}
          <button
            className="btn btn-outline-secondary"
            onClick={() => setSidebarOpen(!sidebarOpen)}//flip true to false
          >
            ☰ Menu
          </button>
          {/* {User Info display} */}
          <div className="d-flex align-items-center gap-3">
            <span className="text-muted">{user?.fullName || user?.name || 'Admin'}</span>
          </div>
        </header>

        {/* {Main Content} */}
        <main className="flex-grow-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}