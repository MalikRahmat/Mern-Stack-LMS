import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import Loader from '../../components/common/Loader';
import courseService from '../../services/courseService';
import { useAuth } from '../../hooks/useAuth';

export const InstructorDashboard = () => {
  // Authenticated user data
  const { user } = useAuth();

  // Instructor courses state
  const [courses, setCourses] = useState([]);

  // Loading state for API request
  const [loading, setLoading] = useState(true);

  // Error state for API failure handling
  const [error, setError] = useState(null);

  /**
   * Fetch instructor courses on component mount
   */
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);

        const data = await courseService.getInstructorCourses();
        setCourses(data || []);
      } catch (err) {
        setError(
          err.response?.data?.message || 'Failed to download your courses.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Derived statistics from courses list
  const totalCourses = courses.length;
  const categoriesCount = new Set(courses.map((c) => c.category)).size;
  const paidCourses = courses.filter((c) => c.price > 0).length;

  return (
    <DashboardLayout>
      {/* Page Header Section - Fully Responsive Layout */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold text-dark mb-1">Instructor Hub</h2>
          <p className="text-muted small mb-0">
            Welcome back, Professor {user?.name}! Prepare and publish educational resources.
          </p>
        </div>

        {/* Action Buttons with text-nowrap and mobile-stacking */}
        <div className="d-flex gap-2 w-100 w-sm-auto flex-wrap">
          <Link
            to="/instructor/create-course"
            className="btn btn-primary btn-sm d-inline-flex align-items-center text-nowrap"
          >
            <i className="bi bi-journal-plus me-2"></i>Create Course
          </Link>

          <Link
            to="/instructor/upload-lessons"
            className="btn btn-outline-primary btn-sm d-inline-flex align-items-center text-nowrap"
          >
            <i className="bi bi-cloud-arrow-up-fill me-2"></i>Upload Lectures
          </Link>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger shadow-sm" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <Loader message="Synthesizing teaching terminal..." />
      ) : (
        <div className="row g-4">
          {/* Quick Metrics Section */}
          <div className="col-12 col-md-4">
            <div className="card shadow-sm border-0 bg-white p-4 h-100 text-center">
              <div
                className="bg-primary-subtle text-primary rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3"
                style={{ width: '56px', height: '56px' }}
              >
                <i className="bi bi-journals fs-3"></i>
              </div>

              <h5 className="text-muted text-uppercase small fw-bold">
                Published Courses
              </h5>
              <h2 className="fw-extrabold text-dark mb-0">{totalCourses}</h2>

              <Link
                to="/instructor/courses"
                className="small text-decoration-none text-primary fw-semibold mt-2 d-inline-block"
              >
                Manage Course Library <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="card shadow-sm border-0 bg-white p-4 h-100 text-center">
              <div
                className="bg-success-subtle text-success rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3"
                style={{ width: '56px', height: '56px' }}
              >
                <i className="bi bi-tag-fill fs-3"></i>
              </div>

              <h5 className="text-muted text-uppercase small fw-bold">
                Syllabus Categories
              </h5>
              <h2 className="fw-extrabold text-dark mb-0">{categoriesCount}</h2>

              <span className="small text-muted mt-2 d-inline-block">
                Target disciplines
              </span>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="card shadow-sm border-0 bg-white p-4 h-100 text-center">
              <div
                className="bg-info-subtle text-info rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3"
                style={{ width: '56px', height: '56px' }}
              >
                <i className="bi bi-cash-coin fs-3"></i>
              </div>

              <h5 className="text-muted text-uppercase small fw-bold">
                Premium Materials
              </h5>

              <h2 className="fw-extrabold text-dark mb-0">
                {paidCourses}{' '}
                <small className="fs-6 text-muted">/ {totalCourses}</small>
              </h2> 

              <span className="small text-muted mt-2 d-inline-block">
                Monetized courses
              </span>
            </div>
          </div>

          {/* Courses Table Section */}
          <div className="col-12">
            <div className="card shadow-sm border-0 bg-white p-4" style={{ borderRadius: '12px' }}>
              <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <h5 className="fw-bold text-dark mb-0">
                  Active Curriculum Catalogs
                </h5>
                <Link to="/instructor/courses" className="btn btn-sm btn-light text-nowrap">
                  View All
                </Link>
              </div>

              <hr />

              {/* Empty State */}
              {courses.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <i className="bi bi-journal-x fs-1 opacity-50 d-block mb-2"></i>
                  <p className="small mb-0">
                    You have not published any course catalogs yet.
                  </p>
                  <Link
                    to="/instructor/create-course"
                    className="btn btn-primary btn-sm mt-3"
                  >
                    Publish First Course
                  </Link>
                </div>
              ) : (
                /* Protected Responsive Table Wrapper */
                <div className="table-responsive w-100" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light text-nowrap">
                      <tr>
                        <th scope="col" style={{ minWidth: '320px' }}>Course Title</th>
                        <th scope="col" style={{ minWidth: '150px' }}>Category</th>
                        <th scope="col" style={{ minWidth: '120px' }}>Fee (USD)</th>
                        <th scope="col" className="text-end" style={{ minWidth: '160px' }}>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {/* Render instructor courses */}
                      {courses.map((c) => (
                        <tr key={c._id}>
                          <td>
                            <span className="fw-bold d-block text-dark">
                              {c.title}
                            </span>
                            <small 
                              className="text-muted d-block text-truncate"
                              style={{ maxWidth: '300px' }}
                              title={c.description}
                            >
                              {c.description}
                            </small>
                          </td>

                          <td className="text-nowrap">
                            <span className="badge bg-secondary-subtle text-secondary text-uppercase" style={{ fontSize: '0.65rem' }}>
                              {c.category}
                            </span>
                          </td>

                          <td className="text-nowrap">
                            <span className="fw-bold text-dark">
                              ${c.price}
                            </span>
                          </td>

                          <td className="text-end text-nowrap">
                            <div className="d-flex gap-2 justify-content-end text-nowrap">
                              <Link
                                to={`/courses/${c._id}`}
                                className="btn btn-outline-info btn-sm d-inline-flex align-items-center"
                              >
                                <i className="bi bi-eye me-1"></i> View
                              </Link>

                              <Link
                                to={`/instructor/courses/edit/${c._id}`}
                                className="btn btn-outline-primary btn-sm d-inline-flex align-items-center"
                              >
                                <i className="bi bi-pencil me-1"></i> Edit
                              </Link>
                            </div>
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

export default InstructorDashboard;