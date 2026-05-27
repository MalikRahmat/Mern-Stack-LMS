import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import Loader from '../../components/common/Loader';
import courseService from '../../services/courseService';

export const ManageCourses = () => {
  // State for courses list
  const [courses, setCourses] = useState([]);

  // Loading state for API request
  const [loading, setLoading] = useState(true);

  // Error state for API failure handling
  const [error, setError] = useState(null);

  // Message state for success/error notifications
  const [msg, setMsg] = useState({ type: '', text: '' });

  /**
   * Fetch instructor courses from API
   */
  const fetchCourses = async () => {
    try {
      setLoading(true);

      const data = await courseService.getInstructorCourses();
      setCourses(data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to list course catalogues.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  /**
   * Handle course deletion
   */
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      'Are you absolutely certain you want to redact/delete this course material completely?'
    );

    if (!confirmDelete) return;

    try {
      await courseService.deleteCourse(id);

      setMsg({ type: 'success', text: 'Course deleted successfully!' });

      fetchCourses();
    } catch (err) {
      setMsg({
        type: 'danger',
        text: err.response?.data?.message || 'Failed to redact curriculum.',
      });
    }
  };

  return (
    <DashboardLayout>
      {/* Responsive Page Header Section - Converts to vertical stack on mobile viewports */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold text-dark mb-1">Course Catalog Workspace</h2>
          <p className="text-muted small mb-0">
            List, edit, redact, and deploy syllabus models to the community.
          </p>
        </div>

        <Link to="/instructor/create-course" className="btn btn-primary btn-sm text-nowrap flex-shrink-0">
          <i className="bi bi-journal-plus me-1"></i>New Course
        </Link>
      </div>

      {/* Notification Message */}
      {msg.text && (
        <div
          className={`alert alert-${msg.type} alert-dismissible fade show`}
          role="alert"
        >
          <i className="bi bi-info-circle-fill me-2"></i>
          {msg.text}
          <button
            type="button"
            className="btn-close"
            onClick={() => setMsg({ type: '', text: '' })}
          ></button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <Loader message="Fetching teaching list catalogs..." />
      ) : courses.length === 0 ? (
        <div className="text-center py-5 bg-white border rounded shadow-sm">
          <i
            className="bi bi-journal-x text-muted"
            style={{ fontSize: '3.5rem' }}
          ></i>
          <h4 className="fw-bold text-slate-800 mt-3">
            You have not published any courses yet
          </h4>
          <p className="text-muted small">
            Select publish catalog to begin onboarding students.
          </p>
          <Link
            to="/instructor/create-course"
            className="btn btn-primary mt-3"
          >
            Publish First Course
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {/* Course Cards List */}
          {courses.map((course) => (
            <div key={course._id} className="col-md-6 col-lg-4">
              <div
                className="card h-100 border-0 shadow-sm overflow-hidden"
                title={course.title}
              >
                {/* Category Header */}
                <div
                  className="bg-primary text-white p-4 d-flex align-items-center justify-content-center"
                  style={{
                    height: '120px',
                    background:
                      'linear-gradient(135deg, #4f46e5 0%, #1e1b4b 100%)',
                  }}
                >
                  <span
                    className="badge bg-white text-primary text-uppercase fw-semibold"
                    style={{ fontSize: '0.65rem' }}
                  >
                    {course.category}
                  </span>
                </div>

                <div className="card-body d-flex flex-column p-4">
                  <h5 className="card-title fw-bold text-dark text-truncate mb-2">
                    {course.title}
                  </h5>

                  <p
                    className="card-text text-muted small flex-grow-1"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {course.description}
                  </p>

                  {/* Footer Actions */}
                  <div className="border-top pt-3 mt-3 d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-indigo-600">
                      ${course.price}
                    </span>

                    <div className="d-flex gap-2">
                      <Link
                        to={`/instructor/courses/edit/${course._id}`}
                        className="btn btn-outline-primary btn-sm"
                      >
                        <i className="bi bi-pencil-fill"></i>
                      </Link>

                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(course._id)}
                      >
                        <i className="bi bi-trash-fill"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default ManageCourses;