import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [hideNav, setHideNav] = useState(false);

  // optional: hide navbar when scrolling down, show when scrolling up
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y > lastY && y > 60) setHideNav(true);
      else setHideNav(false);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/");
  };

  return (
    <>
      <header className={`site-header sticky-top ${hideNav ? "nav-hidden" : ""}`}>
        <div className="container-fluid">
          <div className="d-flex align-items-center justify-content-between py-2">
            {/* LEFT: Logo */}
            <div className="header-left d-flex align-items-center">
              <Link to="/" className="navbar-brand mb-0 h1 text-decoration-none">
                RentYourCar
              </Link>
            </div>

            {/* CENTER: Nav links (centered on md+) */}
            <div className="header-center flex-grow-1 d-none d-md-flex justify-content-center">
              <nav className="nav gap-3">
                <Link to="/" className="nav-link text-dark">Home</Link>
                <Link to="/cars" className="nav-link text-dark">Cars</Link>
                <Link to="/about" className="nav-link text-dark">About</Link>
                <Link to="/contact" className="nav-link text-dark">Contact</Link>
              </nav>
            </div>

            {/* RIGHT: Auth + Mobile toggler */}
            <div className="header-right d-flex align-items-center gap-2">
              {/* Desktop auth (hidden on small) */}
              <div className="d-none d-md-flex align-items-center gap-2">
                {user ? (
                  <>
                    <Link 
                      to="/profile" 
                      className="nav-link text-dark mb-0 text-decoration-none"
                      style={{ cursor: 'pointer', fontWeight: '500' }}
                    >
                      👤 {user.name || user.fullName || user.email}
                    </Link>
                    <Link 
                      to="/bookings" 
                      className="btn btn-sm btn-outline-primary"
                    >
                      📋 My Bookings
                    </Link>
                    <Link 
                      to="/complaints" 
                      className="btn btn-sm btn-outline-warning"
                    >
                      📝 Complaints
                    </Link>
                    <button className="btn btn-sm btn-outline-dark" onClick={handleLogout}>
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="btn btn-sm btn-outline-dark">Login</Link>
                    <Link to="/register" className="btn btn-sm btn-dark">Register</Link>
                  </>
                )}
              </div>

              {/* Mobile hamburger (visible only on small screens) */}
              <button
                className="navbar-toggler d-md-none"
                type="button"
                aria-controls="mobileNav"
                aria-expanded={isOpen}
                aria-label="Toggle navigation"
                onClick={() => setIsOpen(!isOpen)}
              >
                <span className="navbar-toggler-icon"></span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu (collapses below header) */}
      <div
        id="mobileNav"
        className={`mobile-nav d-md-none ${isOpen ? "open" : ""}`}
        aria-hidden={!isOpen}
      >
        <nav className="d-flex flex-column p-3 gap-2">
          <Link to="/" className="nav-link" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/cars" className="nav-link" onClick={() => setIsOpen(false)}>Cars</Link>
          <Link to="/about" className="nav-link" onClick={() => setIsOpen(false)}>About</Link>
          <Link to="/contact" className="nav-link" onClick={() => setIsOpen(false)}>Contact</Link>

          <hr />

          {user ? (
            <>
              <Link 
                to="/profile" 
                className="nav-link text-decoration-none"
                onClick={() => setIsOpen(false)}
              >
                👤 {user.name || user.fullName || user.email}
              </Link>
              <Link 
                to="/bookings" 
                className="nav-link text-decoration-none"
                onClick={() => setIsOpen(false)}
              >
                📋 My Bookings
              </Link>
              <Link 
                to="/complaints" 
                className="nav-link text-decoration-none"
                onClick={() => setIsOpen(false)}
              >
                📝 My Complaints
              </Link>
              <button className="btn btn-sm btn-outline-dark w-100" onClick={() => { handleLogout(); setIsOpen(false); }}>
                Logout
              </button>
            </>
          ) : (
            <div className="d-flex gap-2">
              <Link to="/login" className="btn btn-sm btn-outline-dark flex-grow-1" onClick={() => setIsOpen(false)}>Login</Link>
              <Link to="/register" className="btn btn-sm btn-dark flex-grow-1" onClick={() => setIsOpen(false)}>Register</Link>
            </div>
          )}
        </nav>
      </div>
    </>
  );
}