import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatPrice } from '../../utils/helpers';
import enrollmentService from '../../services/enrollmentService';
import { useAuth } from '../../hooks/useAuth';

/**
 * CourseCard Component
 * Displays course details, enrollment status, progress tracking,
 * and provides actions based on user role and enrollment state.
 */
export const CourseCard = ({ course, status = null, progress = 0 }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!course) return null;

  // Roles shortcuts
  const isAdminOrInstructor = user && (user.role === 'admin' || user.role === 'instructor');

  // Enrollment status flags
  const isApproved = status === 'approved';
  const isPending = status === 'pending';
  const isRejected = status === 'rejected';

  /**
   * Handles course enrollment logic.
   */
  const handleEnroll = async () => {
    try {
      if (!user) {
        localStorage.setItem('pendingEnrollment', course._id);
        navigate('/login');
        return;
      }

      if (user.role !== 'student') {
        alert('Only students can enroll in courses.');
        return;
      }

      await enrollmentService.enrollCourse(course._id);
      navigate('/student/my-courses');
    } catch (error) {
      alert(error.response?.data?.message || 'Enrollment failed. Please try again.');
    }
  };

  return (
    <div className="card h-100 border-0 shadow-sm overflow-hidden" style={{ borderRadius: '12px' }}>
      {/* Course Image / Category */}
      <div
        className="course-card-img text-white d-flex align-items-center justify-content-center"
        style={{
          height: '160px',
          background: 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)',
          position: 'relative',
        }}
      >
        <span
          className="position-absolute top-0 end-0 bg-dark text-white text-uppercase px-3 py-1 m-2 rounded small"
          style={{ fontSize: '0.65rem' }}
        >
          {course.category}
        </span>
        <i className="bi bi-laptop fs-1 opacity-75"></i>
      </div>

      {/* Course Content */}
      <div className="card-body d-flex flex-column">
        <h5 className="card-title fw-bold text-dark text-truncate" title={course.title}>
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

        {/* Approved Enrollment - Progress Bar (Only for students) */}
        {isApproved && !isAdminOrInstructor && (
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center text-muted small mb-1">
              <span>Progress</span>
              <span className="fw-bold">{progress}%</span>
            </div>
            <div className="progress" style={{ height: '6px' }}>
              <div className="progress-bar bg-success" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* Pending Enrollment */}
        {isPending && !isAdminOrInstructor && (
          <div className="alert alert-warning py-1 px-2 mb-3 text-center small fw-semibold border-0">
            <i className="bi bi-hourglass me-1"></i>
            Pending Approval
          </div>
        )}

        {/* Rejected Enrollment */}
        {isRejected && !isAdminOrInstructor && (
          <div className="alert alert-danger py-1 px-2 mb-3 text-center small fw-semibold border-0">
            <i className="bi bi-x-circle me-1"></i>
            Rejected by Admin
          </div>
        )}

        {/* Price & Instructor */}
        {!isApproved && (
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-muted small">
              By {course.instructor?.name || 'Academic Faculty'}
            </span>
            <span className="badge bg-primary-subtle text-primary fw-bold">
              {formatPrice(course.price)}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-auto d-grid gap-2">
          {/* Admin or Instructor View */}
          {isAdminOrInstructor ? (
            <Link to={`/courses/${course._id}`} className="btn btn-primary w-100 fw-semibold">
              Explore Course
            </Link>
          ) : (
            <>
              {/* Student Approved */}
              {isApproved && (
                <Link to={`/courses/${course._id}`} className="btn btn-success w-100 fw-semibold">
                  Resume Learning
                </Link>
              )}

              {/* Student Pending */}
              {isPending && (
                <button className="btn btn-warning w-100 fw-semibold" disabled>
                  Pending Approval
                </button>
              )}

              {/* Student Rejected */}
              {isRejected && (
                <>
                  <button className="btn btn-outline-danger w-100 fw-semibold" disabled>
                    Rejected by Admin
                  </button>
                  <button onClick={handleEnroll} className="btn btn-danger w-100 fw-semibold">
                    Enroll Again
                  </button>
                </>
              )}

              {/* Public / Not Enrolled User */}
              {!status && (
                <>
                  <Link to={`/course-overview/${course._id}`} className="btn btn-outline-primary w-100 fw-semibold">
                    Explore Course
                  </Link>
                  <button onClick={handleEnroll} className="btn btn-primary w-100 fw-semibold">
                    Enroll Now
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;