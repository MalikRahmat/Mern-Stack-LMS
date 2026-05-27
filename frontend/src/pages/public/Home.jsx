import React from "react";
import { Link } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";

const Home = () => {
  return (
    <MainLayout>
      {/* Hero Banner */}
      <section
        className="bg-dark text-white text-center py-5 d-flex align-items-center"
        style={{
          minHeight: "400px",
          background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
        }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <span className="badge bg-primary text-uppercase px-3 py-2 mb-3 fw-bold fs-6">
                Learning Made Simple
              </span>

              <h1 className="display-4 fw-bold text-white mb-3">
                MERN Stack Learning Management System
              </h1>

              <p className="lead text-white-50 mb-4">
                A complete academic platform where students learn, instructors
                teach, and admins manage — powered by React, Node.js, Express,
                and MongoDB.
              </p>

              <div className="d-flex justify-content-center gap-3">
                <Link to="/courses" className="btn btn-primary btn-lg px-4">
                  <i className="bi bi-rocket-takeoff-fill me-2"></i>
                  Browse Courses
                </Link>

                <Link to="/register" className="btn btn-outline-light btn-lg px-4">
                  <i className="bi bi-person-plus-fill me-2"></i>
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold text-dark">Role-Based Dashboards</h2>
            <p className="text-muted">
              Tailored experiences for every user — secure, efficient, and
              purpose-driven.
            </p>
          </div>

          <div className="row g-4 justify-content-center">
            {/* Student */}
            <div className="col-md-4">
              <Link to="/student/dashboard" className="text-decoration-none">
                <div className="card h-100 border-0 shadow-sm p-4 text-center hover-shadow">
                  <div
                    className="bg-primary-subtle text-primary rounded-circle mx-auto d-flex align-items-center justify-content-center mb-4"
                    style={{ width: "64px", height: "64px" }}
                  >
                    <i className="bi bi-mortarboard-fill fs-3"></i>
                  </div>

                  <h4 className="fw-bold mb-2">Student Portal</h4>

                  <p className="text-muted small">
                    Register, browse courses, enroll instantly, and track your
                    learning progress in one place.
                  </p>
                </div>
              </Link>
            </div>

            {/* Instructor */}
            <div className="col-md-4">
              <Link to="/instructor/dashboard" className="text-decoration-none">
                <div className="card h-100 border-0 shadow-sm p-4 text-center hover-shadow">
                  <div
                    className="bg-success-subtle text-success rounded-circle mx-auto d-flex align-items-center justify-content-center mb-4"
                    style={{ width: "64px", height: "64px" }}
                  >
                    <i className="bi bi-journal-plus fs-3"></i>
                  </div>

                  <h4 className="fw-bold mb-2">Instructor Portal</h4>

                  <p className="text-muted small">
                    Create and manage courses, upload lessons, and engage with
                    students through structured content.
                  </p>
                </div>
              </Link>
            </div>

            {/* Admin */}
            <div className="col-md-4">
              <Link to="/admin/dashboard" className="text-decoration-none">
                <div className="card h-100 border-0 shadow-sm p-4 text-center hover-shadow">
                  <div
                    className="bg-danger-subtle text-danger rounded-circle mx-auto d-flex align-items-center justify-content-center mb-4"
                    style={{ width: "64px", height: "64px" }}
                  >
                    <i className="bi bi-shield-lock-fill fs-3"></i>
                  </div>

                  <h4 className="fw-bold mb-2">Admin Dashboard</h4>

                  <p className="text-muted small">
                    Manage users, oversee courses, and view analytics to ensure
                    smooth platform operations.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-white border-top">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 mb-4 mb-md-0">
              <h2 className="fw-bold mb-3">Core Features</h2>

              <p className="text-muted mb-4">
                This LMS demonstrates real-world MERN stack development with
                secure authentication, role-based authorization, and scalable
                course management.
              </p>

              <ul className="list-unstyled">
                <li className="mb-2 d-flex align-items-center">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  <span>JWT Authentication & Bcrypt Security</span>
                </li>

                <li className="mb-2 d-flex align-items-center">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  <span>Role-Based Dashboards (Admin, Instructor, Student)</span>
                </li>

                <li className="mb-2 d-flex align-items-center">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  <span>RESTful APIs with Express.js</span>
                </li>

                <li className="mb-2 d-flex align-items-center">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  <span>MongoDB + Mongoose Database Models</span>
                </li>
              </ul>
            </div>

            <div className="col-md-6 text-center">
              <div className="bg-light p-5 rounded border shadow-sm">
                <span className="text-uppercase text-primary fw-bold d-block pb-1">
                  Powered by MERN
                </span>

                <h3 className="fw-bold text-dark">Industry-Level Standards</h3>

                <p className="text-muted small">
                  Designed to meet academic requirements while reflecting
                  professional coding practices.
                </p>

                <div className="d-flex justify-content-center gap-3 mt-4">
                  <span className="badge bg-secondary p-2">React</span>
                  <span className="badge bg-secondary p-2">Node.js</span>
                  <span className="badge bg-secondary p-2">Express.js</span>
                  <span className="badge bg-secondary p-2">MongoDB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Home;