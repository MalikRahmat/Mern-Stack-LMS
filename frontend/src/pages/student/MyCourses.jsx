import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Loader from '../../components/common/Loader';
import CourseCard from '../../components/courses/CourseCard';
import enrollmentService from '../../services/enrollmentService';

export const MyCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch all enrolled courses for the authenticated user
    const fetchEnrolled = async () => {
      try {
        setLoading(true);

        const data = await enrollmentService.getMyCourses();

        // Filter out rejected enrollments from active course list
        const filteredData = (data || []).filter(
          (item) => item.status !== 'rejected'
        );

        setEnrollments(filteredData);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            'Failed to download academic records.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolled();
  }, []);

  return (
    <DashboardLayout>
      {/* Page Header Section */}
      <div className="mb-4">
        <h2 className="fw-bold text-dark">My Academic Courses</h2>
        <p className="text-muted small">
          Access and track lectures on enrolled materials.
        </p>
      </div>

      {/* Error State Display */}
      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <Loader message="Loading workspace milestones..." />
      ) : enrollments.length === 0 ? (
        /* Empty State UI */
        <div className="text-center py-5 bg-white rounded shadow-sm border">
          <i
            className="bi bi-journal-x text-muted"
            style={{ fontSize: '3.5rem' }}
          ></i>
          <h4 className="fw-bold text-dark mt-3">
            No active enrollments recorded
          </h4>
          <p className="text-muted small">
            Your pending or approved courses will appear here. Rejected
            applications are moved back to the main course catalog.
          </p>
        </div>
      ) : (
        /* Courses Grid */
        <div className="row g-4">
          {enrollments.map((item) => (
            <div key={item._id} className="col-md-6 col-lg-4">
              <CourseCard
                course={item.course}
                status={item.status}
                progress={item.progress || 0}
              />
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyCourses;