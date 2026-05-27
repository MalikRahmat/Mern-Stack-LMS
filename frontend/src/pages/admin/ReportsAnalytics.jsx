import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Charts from '../../components/dashboard/Charts';
import Loader from '../../components/common/Loader';
import analyticsService from '../../services/analyticsService';

export const ReportsAnalytics = () => {
  // Analytics state management
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch analytics data on component mount
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const data = await analyticsService.getAnalytics();
        setStats(data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            'Failed to load analytics reports.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-4">
        <h2 className="fw-bold text-dark">
          Reports & Analytics
        </h2>

        <p className="text-muted small mb-0">
          Visual insights for enrollments, course distribution, and system activity.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger shadow-sm" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <Loader message="Loading analytics reports..." />
      ) : (
        <div className="row g-4">
          
          {/* Charts Section - Wrapped safely to handle pure fluid width recalculations */}
          <div className="col-12 w-100 style-chart-wrapper" style={{ minWidth: 0 }}>
            <Charts stats={stats} />
          </div>

          {/* System Statistics Summary */}
          <div className="col-12 col-lg-6">
            <div className="card shadow-sm border-0 bg-white p-4 h-100" style={{ borderRadius: '12px' }}>
              <h5 className="fw-bold text-dark mb-3">
                System Statistics
              </h5>

              <hr className="text-muted opacity-25" />

              <div className="d-flex justify-content-between py-2 border-bottom text-muted">
                <span>Students</span>
                <strong className="text-dark">
                  {stats?.usersSummary?.students || 0} Accounts
                </strong>
              </div>

              <div className="d-flex justify-content-between py-2 border-bottom text-muted">
                <span>Instructors</span>
                <strong className="text-dark">
                  {stats?.usersSummary?.instructors || 0} Accounts
                </strong>
              </div>

              <div className="d-flex justify-content-between py-2 border-bottom text-muted">
                <span>Administrators</span>
                <strong className="text-dark">
                  {stats?.usersSummary?.admins || 0} Accounts
                </strong>
              </div>

              <div className="d-flex justify-content-between py-2 border-bottom text-muted">
                <span>Total Courses</span>
                <strong className="text-dark">
                  {stats?.coursesSummary?.total || 0} Courses
                </strong>
              </div>

              <div className="d-flex justify-content-between py-2 text-muted">
                <span>Total Enrollments</span>
                <strong className="text-dark">
                  {stats?.enrollmentsSummary?.total || 0} Records
                </strong>
              </div>
            </div>
          </div>

          {/* Popular Courses Ranking Section */}
          <div className="col-12 col-lg-6">
            <div className="card shadow-sm border-0 bg-white p-4 h-100" style={{ borderRadius: '12px' }}>
              <h5 className="fw-bold text-dark mb-3">
                Most Popular Courses
              </h5>

              <hr className="text-muted opacity-25" />

              {!stats?.enrollmentsSummary?.popularCourses ||
              stats.enrollmentsSummary.popularCourses.length === 0 ? (
                <div className="text-center text-muted small py-4">
                  No enrollment data available.
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {stats.enrollmentsSummary.popularCourses.map((course, index) => (
                    
                    <div
                      key={index}
                      className="list-group-item border-0 d-flex flex-column flex-sm-row justify-content-sm-between align-items-start align-items-sm-center bg-transparent py-2 px-0 gap-2"
                    >
                      <div className="d-flex align-items-center w-100 style-text-block" style={{ minWidth: 0 }}>
                        <span className="badge bg-primary text-white me-2 flex-shrink-0" style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {index + 1}
                        </span>

                        
                        <span
                          className="fw-semibold text-dark text-truncate d-inline-block"
                          style={{ maxWidth: '85%' }}
                          title={course.title}
                        >
                          {course.title}
                        </span>
                      </div>

                      {/* Badge padding, placement and overflow boundary parameters fixed */}
                      <span className="badge bg-success rounded-pill px-3 py-1 flex-shrink-0 ms-sm-auto">
                        {course.enrollmentCount} Students
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </DashboardLayout>
  );
};

export default ReportsAnalytics;