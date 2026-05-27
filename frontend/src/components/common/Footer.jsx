import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Footer Component
 * Provides a structured footer with brand information,
 * quick navigation links, account shortcuts, and tech stack badges.
 */
export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-light pt-5 pb-3 mt-auto border-top border-secondary">
      <div className="container">
        <div className="row g-4">
          
          {/* Column 1: Brand & Tagline */}
          <div className="col-lg-4 col-md-6">
            <h5 className="fw-bold text-info mb-3 d-flex align-items-center">
              <i className="bi bi-mortarboard-fill me-2"></i>
              EduMERN LMS
            </h5>
            <p className="text-secondary small lh-base">
              An enterprise-grade MERN stack learning ecosystem featuring robust role-based authorization, high-performance database indexing, and streamlined analytical layouts.
            </p>
            {/* Social Icons */}
            <div className="d-flex gap-3 mt-3">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="text-secondary text-info-hover fs-5">
                <i className="bi bi-github"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-secondary text-info-hover fs-5">
                <i className="bi bi-linkedin"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-secondary text-info-hover fs-5">
                <i className="bi bi-twitter"></i>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Navigation */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="fw-bold text-white small text-uppercase mb-3 tracking-wider">Explore Catalog</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li>
                <Link to="/" className="text-secondary text-decoration-none text-white-hover">
                  <i className="bi bi-chevron-right small me-1"></i> Home Portal
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-secondary text-decoration-none text-white-hover">
                  <i className="bi bi-chevron-right small me-1"></i> Browse Courses
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-secondary text-decoration-none text-white-hover">
                  <i className="bi bi-chevron-right small me-1"></i> About System
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Dashboard Shortcuts */}
          <div className="col-lg-3 col-md-6 col-6">
            <h6 className="fw-bold text-white small text-uppercase mb-3 tracking-wider">Account Gateways</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li>
                <Link to="/login" className="text-secondary text-decoration-none text-white-hover">
                  <i className="bi bi-shield-lock me-2"></i> Secure Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-secondary text-decoration-none text-white-hover">
                  <i className="bi bi-person-plus me-2"></i> Join As Student
                </Link>
              </li>
              <li>
                <span className="text-secondary opacity-75">
                  <i className="bi bi-person-badge me-2"></i> Instructor Node
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Tech Stack Badges */}
          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold text-white small text-uppercase mb-3 tracking-wider">Engine Specs</h6>
            <div className="d-flex flex-wrap gap-2">
              <span className="badge bg-secondary bg-opacity-25 text-secondary border border-secondary border-opacity-50 px-2 py-1.5 rounded-1 small">React v18</span>
              <span className="badge bg-secondary bg-opacity-25 text-secondary border border-secondary border-opacity-50 px-2 py-1.5 rounded-1 small">Node.js</span>
              <span className="badge bg-secondary bg-opacity-25 text-secondary border border-secondary border-opacity-50 px-2 py-1.5 rounded-1 small">MongoDB</span>
              <span className="badge bg-secondary bg-opacity-25 text-secondary border border-secondary border-opacity-50 px-2 py-1.5 rounded-1 small">JWT Auth</span>
              <span className="badge bg-secondary bg-opacity-25 text-secondary border border-secondary border-opacity-50 px-2 py-1.5 rounded-1 small">Bootstrap 5</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-4 border-secondary opacity-25" />

        {/* Bottom Bar */}
        <div className="row align-items-center small text-secondary">
          <div className="col-md-6 text-center text-md-start mb-2 mb-md-0">
            &copy; {currentYear} <strong>EduMERN LMS</strong>. All rights reserved.
          </div>
          <div className="col-md-6 text-center text-md-end">
            <span className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 px-3 py-2">
              <i className="bi bi-check-circle-fill me-1"></i> Verified Capstone Project Submission
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
