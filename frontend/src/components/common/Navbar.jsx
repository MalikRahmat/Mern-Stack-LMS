import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * Navbar Component
 * Provides the main navigation bar with brand logo,
 * navigation links, user account menu, and global notifications.
 */
export const Navbar = () => {
  const { user, logout, message } = useAuth();
  const navigate = useNavigate();

  /**
   * Handles user logout and redirects to login page.
   */
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Navigation Bar */}
      <nav
        className="navbar navbar-expand-lg navbar-light sticky-top bg-white border-bottom"
        style={{
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '0.8rem 0',
        }}
      >
        <div className="container">
          {/* Brand Logo */}
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <div
              className="d-flex align-items-center justify-content-center rounded-3 me-2"
              style={{ width: '38px', height: '38px', backgroundColor: '#4f46e5' }}
            >
              <i className="bi bi-journal-bookmark-fill text-white fs-5"></i>
            </div>
            <span
              className="fw-extrabold tracking-tight text-dark fs-4 m-0"
              style={{ letterSpacing: '-0.5px' }}
            >
              Edu<span style={{ color: '#4f46e5' }}>MERN</span>
            </span>
          </Link>

          {/* Mobile Toggle Button */}
          <button
            className="navbar-toggler border-0 shadow-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Collapsible Menu */}
          <div className="collapse navbar-collapse" id="navbarNav">
            {/* Navigation Links */}
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-1 gap-lg-3">
              <li className="nav-item">
                <Link className="nav-link fw-medium text-secondary px-3 py-2 rounded-2" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link fw-medium text-secondary px-3 py-2 rounded-2" to="/courses">
                  Courses
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link fw-medium text-secondary px-3 py-2 rounded-2" to="/about">
                  About Us
                </Link>
              </li>
            </ul>

            {/* User Menu / Action Buttons */}
            <div className="d-flex align-items-center mt-3 mt-lg-0">
              {user ? (
                <div className="dropdown w-100 text-start">
                  <button
                    className="btn btn-link text-decoration-none dropdown-toggle d-flex align-items-center text-dark p-1 border-0"
                    type="button"
                    id="userDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <div className="position-relative me-2">
                      <i className="bi bi-person-circle fs-4" style={{ color: '#4f46e5' }}></i>
                      <span className="position-absolute bottom-0 end-0 p-1 bg-success border border-white rounded-circle"></span>
                    </div>
                    <div className="d-flex flex-column text-start me-2">
                      <span className="fw-semibold lh-sm" style={{ fontSize: '0.9rem' }}>{user.name}</span>
                      <span
                        className="text-muted text-uppercase fw-bold"
                        style={{ fontSize: '0.65rem', letterSpacing: '0.5px' }}
                      >
                        {user.role}
                      </span>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  <ul
                    className="dropdown-menu dropdown-menu-end shadow-lg border-0 p-2 mt-2"
                    aria-labelledby="userDropdown"
                    style={{ borderRadius: '12px', minWidth: '220px' }}
                  >
                    <li className="dropdown-header text-muted pb-2 border-bottom mb-1" style={{ fontSize: '0.75rem' }}>
                      NAVIGATION
                    </li>
                    <li>
                      {user.role === 'admin' && (
                        <Link className="dropdown-item py-2.5 rounded-2" to="/admin/dashboard">
                          <i className="bi bi-speedometer2 me-2" style={{ color: '#4f46e5' }}></i> Admin Dashboard
                        </Link>
                      )}
                      {user.role === 'instructor' && (
                        <Link className="dropdown-item py-2.5 rounded-2" to="/instructor/dashboard">
                          <i className="bi bi-speedometer2 me-2" style={{ color: '#4f46e5' }}></i> Instructor Dashboard
                        </Link>
                      )}
                      {user.role === 'student' && (
                        <Link className="dropdown-item py-2.5 rounded-2" to="/student/dashboard">
                          <i className="bi bi-speedometer2 me-2" style={{ color: '#4f46e5' }}></i> Student Dashboard
                        </Link>
                      )}
                    </li>
                    <li>
                      <hr className="dropdown-divider my-2 opacity-50" />
                    </li>
                    <li>
                      <button
                        className="dropdown-item text-danger py-2.5 rounded-2 fw-medium"
                        onClick={handleLogout}
                      >
                        <i className="bi bi-box-arrow-right me-2"></i> Logout
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="d-flex align-items-center gap-2 ms-lg-3 mt-3 mt-lg-0 flex-nowrap">
                  <Link
                    className="btn btn-light fw-semibold text-dark border-0 d-inline-flex align-items-center justify-content-center"
                    to="/login"
                    style={{
                      borderRadius: '8px',
                      backgroundColor: '#f3f4f6',
                      height: '42px',
                      padding: '0 24px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Log in
                  </Link>
                  <Link
                    className="btn fw-semibold text-white d-inline-flex align-items-center justify-content-center"
                    to="/register"
                    style={{
                      borderRadius: '8px',
                      backgroundColor: '#4f46e5',
                      height: '42px',
                      padding: '0 24px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Global Success Message Notification */}
      {message && (
        <div
          className="w-100 text-center text-white py-2"
          style={{
            backgroundColor: '#10b981',
            fontSize: '0.85rem',
            fontWeight: '500',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          }}
        >
          <div className="container d-flex align-items-center justify-content-center gap-2">
            <i className="bi bi-check-circle-fill"></i>
            <span>{message}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
