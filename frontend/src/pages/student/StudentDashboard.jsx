import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import Loader from '../../components/common/Loader';
import enrollmentService from '../../services/enrollmentService';
import { useAuth } from '../../hooks/useAuth';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch all enrolled courses for the logged-in student
    const fetchMyCourses = async () => {
      try {
        setLoading(true);

        const data = await enrollmentService.getMyCourses();

        // Backend already filters rejected enrollments,
        // but we still ensure local consistency by removing them
        const activeAndPending = (data || []).filter(
          (c) => c.status !== 'rejected'
        );

        setCourses(activeAndPending);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            'Failed to download enrolled course modules.'
        );
      } finally {
        setError(null); // Reset error states safely
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  // =========================
  // Derived Metrics
  // =========================
  const approvedCourses = courses.filter(
    (c) => c.status === 'approved'
  );

  const pendingCount = courses.filter(
    (c) => c.status === 'pending'
  ).length;

  return (
    <DashboardLayout>
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold text-dark mb-1">Student Workspace</h2>
          <p className="text-muted small mb-0">
            Welcome back, {user?.name}! Track your dynamic lecture milestones.
          </p>
        </div>

        <Link to="/courses" className="btn btn-primary btn-sm text-nowrap flex-shrink-0">
          <i className="bi bi-journal-plus me-1"></i>
          Enroll in Courses
        </Link>
      </div>

      {/* =========================
          Error State
      ========================== */}
      {error && (
        <div className="alert alert-danger shadow-sm" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      )}

      {/* =========================
          Loading State
      ========================== */}
      {loading ? (
        <Loader message="Synthesizing course materials..." />
      ) : (
        <div className="row g-4">

          {/* =========================
              Quick Metrics Card 1
          ========================== */}
          <div className="col-12 col-md-4">
            <div className="card shadow-sm border-0 bg-white p-4 h-100 text-center">
              <div
                className="bg-primary-subtle text-primary rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3"
                style={{ width: '56px', height: '56px' }}
              >
                <i className="bi bi-journal-check fs-3"></i>
              </div>

              <h5 className="text-muted text-uppercase small fw-bold">
                Active Enrollments
              </h5>

              <h2 className="fw-extrabold text-dark mb-0">
                {approvedCourses.length}
              </h2> 

              {pendingCount > 0 && (
                <span className="badge bg-warning-subtle text-warning-emphasis small mt-1">
                  {pendingCount} Pending Approval
                </span>
              )}

              <Link
                to="/student/my-courses"
                className="small text-decoration-none text-primary fw-semibold mt-2 d-inline-block"
              >
                View My List <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
          </div>

          {/* =========================
              Quick Metrics Card 2
          ========================== */}
          <div className="col-12 col-md-4">
            <div className="card shadow-sm border-0 bg-white p-4 h-100 text-center">
              <div
                className="bg-success-subtle text-success rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3"
                style={{ width: '56px', height: '56px' }}
              >
                <i className="bi bi-award-fill fs-3"></i>
              </div>

              <h5 className="text-muted text-uppercase small fw-bold">
                Completed Courses
              </h5>

              <h2 className="fw-extrabold text-dark mb-0">
                {approvedCourses.filter((c) => c.progress === 100).length}
              </h2>

              <span className="small text-muted mt-2 d-inline-block">
                Verified Certificates
              </span>
            </div>
          </div>

          {/* =========================
              Quick Metrics Card 3
          ========================== */}
          <div className="col-12 col-md-4">
            <div className="card shadow-sm border-0 bg-white p-4 h-100 text-center">
              <div
                className="bg-info-subtle text-info rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3"
                style={{ width: '56px', height: '56px' }}
              >
                <i className="bi bi-person-badge fs-3"></i>
              </div>

              <h5 className="text-muted text-uppercase small fw-bold">
                Portal Role
              </h5>

              <h2 className="fw-extrabold text-info text-uppercase mb-0">
                {user?.role}
              </h2>

              <span className="small text-muted mt-2 d-inline-block">
                Academic Access Level
              </span>
            </div>
          </div>

          {/* =========================
              Enrolled Courses Table - Protected Structure
          ========================== */}
          <div className="col-12">
            <div className="card shadow-sm border-0 bg-white p-4" style={{ borderRadius: '12px' }}>
              <h5 className="fw-bold text-dark mb-3">
                Enrolled Classrooms Timeline
              </h5>

              <hr />

              {courses.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <i className="bi bi-journal-x fs-1 opacity-50 d-block mb-2"></i>
                  <p className="small mb-0">
                    No active applications or enrolled modules found.
                  </p>
                  <Link to="/courses" className="btn btn-primary btn-sm mt-3">
                    Start Browsing
                  </Link>
                </div>
              ) : (
                /* Strict Horizontal Scroll Wrapper Injection */
                <div className="table-responsive w-100" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                  <table className="table table-hover align-middle mb-0">

                    {/* Table Header with explicit column constraints */}
                    <thead className="table-light text-nowrap">
                      <tr>
                        <th scope="col" style={{ minWidth: '260px' }}>Curriculum Course</th>
                        <th scope="col" style={{ minWidth: '150px' }}>Category</th>
                        <th scope="col" style={{ minWidth: '200px' }}>Status / Progress</th>
                        <th scope="col" className="text-end" style={{ minWidth: '130px' }}>Actions</th>
                      </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody>
                      {courses.map((c) => (
                        <tr key={c._id}>
                          <td>
                            <span className="fw-bold d-block text-dark">
                              {c.course?.title}
                            </span>
                            <small className="text-muted d-block">
                              By {c.course?.instructor?.name || 'Academic Faculty'}
                            </small>
                          </td>

                          <td className="text-nowrap">
                            <span
                              className="badge bg-secondary-subtle text-secondary text-uppercase"
                              style={{ fontSize: '0.65rem' }}
                            >
                              {c.course?.category}
                            </span>
                          </td>

                          {/* Progress bar container protected from squeezing */}
                          <td>
                            {c.status === 'approved' ? (
                              <div
                                className="d-flex align-items-center text-nowrap"
                                style={{ width: '160px' }}
                              >
                                <span className="fw-bold small me-2" style={{ minWidth: '35px' }}>
                                  {c.progress}%
                                </span>

                                <div
                                  className="progress flex-grow-1"
                                  style={{ height: '6px' }}
                                >
                                  <div
                                    className="progress-bar bg-success rounded"
                                    role="progressbar"
                                    style={{ width: `${c.progress}%` }}
                                    aria-valuenow={c.progress}
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                  ></div>
                                </div>
                              </div>
                            ) : (
                              <span
                                className="badge bg-warning text-dark text-uppercase p-2 text-nowrap"
                                style={{ fontSize: '0.6rem' }}
                              >
                                <i className="bi bi-hourglass-split me-1"></i>
                                Pending Approval
                              </span>
                            )}
                          </td>

                          <td className="text-end text-nowrap">
                            {c.status === 'approved' ? (
                              <Link
                                to={`/courses/${c.course?._id}`}
                                className="btn btn-success btn-sm rounded-pill px-3 fw-semibold"
                              >
                                Resume Lectures
                              </Link>
                            ) : (
                              <button
                                disabled
                                className="btn btn-outline-secondary btn-sm rounded-pill px-3 opacity-50"
                              >
                                Locked
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>

                  </table>
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </DashboardLayout>
  );
};

export default StudentDashboard;