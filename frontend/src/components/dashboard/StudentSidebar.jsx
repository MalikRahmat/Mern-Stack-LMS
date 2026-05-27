import React from 'react';
import { NavLink } from 'react-router-dom';

/**
 * @component StudentSidebar
 * @description Sidebar navigation for student dashboard with collapsible UI and route-based navigation
 */
export const StudentSidebar = ({ user, collapsed, setCollapsed }) => {
  return (
    <div className="sidebar-wrapper d-flex flex-column h-100 bg-dark text-white p-3 position-relative">

      {/* Sidebar toggle button */}
      <button
        className="btn btn-sm btn-light position-absolute top-0 end-0 m-2"
        onClick={() => setCollapsed(!collapsed)}
      >
        <i
          className={`bi ${
            collapsed
              ? 'bi-layout-sidebar-inset-reverse'
              : 'bi-layout-sidebar-inset'
          }`}
        ></i>
      </button>

      {/* Profile section */}
      <div
        className={`text-center mb-4 pb-3 border-bottom border-secondary ${
          collapsed ? 'd-none' : ''
        }`}
      >
        <div
          className="bg-primary text-white rounded-circle mx-auto d-flex align-items-center justify-content-center fw-bold fs-4 mb-2"
          style={{ width: '60px', height: '60px' }}
        >
          <i className="bi bi-mortarboard-fill"></i>
        </div>

        <h6 className="fw-bold mb-0 text-white truncate">
          {user?.name}
        </h6>

        <small
          className="text-white-50 tracking-wide text-uppercase"
          style={{ fontSize: '0.65rem' }}
        >
          Student Account
        </small>
      </div>

      {/* Navigation menu */}
      <nav className={`nav flex-column gap-1 ${collapsed ? 'd-none' : ''}`}>

        <NavLink
          className={({ isActive }) =>
            `sidebar-nav-link d-flex align-items-center p-3 rounded mb-1 text-decoration-none ${
              isActive ? 'bg-primary text-white' : 'text-white-50 hover:bg-secondary'
            }`
          }
          to="/student/dashboard"
          end
        >
          <i className="bi bi-grid-1x2-fill me-3"></i>
          <span>Overview</span>
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            `sidebar-nav-link d-flex align-items-center p-3 rounded mb-1 text-decoration-none ${
              isActive ? 'bg-primary text-white' : 'text-white-50 hover:bg-secondary'
            }`
          }
          to="/student/my-courses"
        >
          <i className="bi bi-journal-bookmark-fill me-3"></i>
          <span>My Enrolled Courses</span>
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            `sidebar-nav-link d-flex align-items-center p-3 rounded mb-1 text-decoration-none ${
              isActive ? 'bg-primary text-white' : 'text-white-50 hover:bg-secondary'
            }`
          }
          to="/student/profile"
        >
          <i className="bi bi-person-circle-fill me-3"></i>
          <span>My Profile</span>
        </NavLink>

      </nav>

      {/* Footer section */}
      <div
        className={`mt-auto pt-3 border-top border-secondary text-center text-white-50 small ${
          collapsed ? 'd-none' : ''
        }`}
        style={{ fontSize: '0.7rem' }}
      >
        LMS Student Terminal v1.1
      </div>

    </div>
  );
};

export default StudentSidebar;