// src/pages/About.js
import React from "react";
import MainLayout from "../../layouts/MainLayout";

const About = () => {
  return (
    <MainLayout>
      {/* Page Wrapper Section */}
      <section className="bg-light py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">

              {/* Main Card Container */}
              <div
                className="card shadow border-0 p-5 bg-white"
                style={{ borderRadius: "16px" }}
              >

                {/* =========================
                    HEADER SECTION
                ========================= */}
                <div className="text-center mb-5">
                  {/* Platform Badge */}
                  <span
                    className="badge bg-primary-subtle text-primary text-uppercase px-3 py-2 mb-2 fw-bold"
                    style={{ fontSize: "0.75rem" }}
                  >
                    About Our Platform
                  </span>

                  {/* Main Title */}
                  <h1 className="fw-bold text-dark">
                    Academic Learning Management System
                  </h1>

                  {/* Subtitle Description */}
                  <p className="text-muted lead">
                    A modern MERN-based LMS empowering students, instructors,
                    and administrators with secure, scalable, and user-friendly
                    learning experiences.
                  </p>
                </div>

                {/* =========================
                    INFORMATION SECTION
                ========================= */}
                <div className="row g-4 mt-2">

                  {/* Vision Section */}
                  <div className="col-md-6">
                    <h5 className="fw-bold text-primary mb-3">
                      🎓 Our Vision
                    </h5>

                    <p className="text-muted small" style={{ lineHeight: "1.6" }}>
                      We aim to bridge the gap between technology and education
                      by providing a platform where students can access courses,
                      instructors can deliver engaging content, and admins can
                      oversee operations with full transparency. This LMS is
                      designed to simulate real-world workflows and industry
                      standards.
                    </p>
                  </div>

                  {/* Technology Stack Section */}
                  <div className="col-md-6">
                    <h5 className="fw-bold text-success mb-3">
                      🛠️ Technology Stack
                    </h5>

                    <p className="text-muted small" style={{ lineHeight: "1.6" }}>
                      Built with React, Node.js, Express, and MongoDB, the
                      system ensures seamless integration between frontend and
                      backend. JWT authentication, Bcrypt password hashing, and
                      role-based authorization guarantee secure access for
                      students, instructors, and admins.
                    </p>
                  </div>
                </div>

                <hr className="my-5" />

                {/* =========================
                    CORE FEATURES SECTION
                ========================= */}
                <div className="bg-light p-4 rounded text-center">

                  {/* Section Title */}
                  <h5 className="fw-bold mb-3">
                    Core Features & Deliverables
                  </h5>

                  {/* Feature Grid */}
                  <div className="row g-3">

                    {/* Feature 1 */}
                    <div className="col-md-4 d-flex">
                      <div className="p-3 bg-white rounded shadow-sm border text-success flex-fill">

                        {/* Icon */}
                        <i className="bi bi-key-fill fs-3 mb-2"></i>

                        {/* Title */}
                        <span className="fw-bold d-block small">
                          Secure Authentication
                        </span>

                        {/* Description */}
                        <small
                          className="text-muted font-mono"
                          style={{ fontSize: "0.75rem" }}
                        >
                          Bcrypt + JWT Protected Routes
                        </small>
                      </div>
                    </div>

                    {/* Feature 2 */}
                    <div className="col-md-4 d-flex">
                      <div className="p-3 bg-white rounded shadow-sm border text-success flex-fill">

                        <i className="bi bi-person-workspace fs-3 mb-2"></i>

                        <span className="fw-bold d-block small">
                          Role-Based Dashboards
                        </span>

                        <small
                          className="text-muted font-mono"
                          style={{ fontSize: "0.75rem" }}
                        >
                          Admin / Instructor / Student
                        </small>
                      </div>
                    </div>

                    {/* Feature 3 */}
                    <div className="col-md-4 d-flex">
                      <div className="p-3 bg-white rounded shadow-sm border text-success flex-fill">

                        <i className="bi bi-database-fill-check fs-3 mb-2"></i>

                        <span className="fw-bold d-block small">
                          Database Integration
                        </span>

                        <small
                          className="text-muted font-mono"
                          style={{ fontSize: "0.75rem" }}
                        >
                          MongoDB + Mongoose Models
                        </small>
                      </div>
                    </div>

                  </div>
                </div>

                {/* =========================
                    CLOSING SECTION
                ========================= */}
                <div className="text-center mt-5">
                  <p className="text-muted small">
                    This LMS project is not just an academic exercise — it is a
                    demonstration of real-world MERN stack development,
                    showcasing authentication, authorization, course management,
                    and scalable architecture for modern education platforms.
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default About;