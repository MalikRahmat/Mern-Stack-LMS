import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import DashboardLayout from '../../layouts/DashboardLayout';
import AnalyticsCards from '../../components/dashboard/AnalyticsCards';
import Charts from '../../components/dashboard/Charts';
import Loader from '../../components/common/Loader';

import analyticsService from '../../services/analyticsService';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await analyticsService.getAnalytics();
        setStats(data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            'Failed to download academic analytics metrics.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    // DashboardLayout wraps the main content and handles sidebar grid structure
    <DashboardLayout>
      {/* Container fluid ensures content stretches nicely but stays contained */}
      <div className="container-fluid px-0">
        
        {/* Dashboard Header */}
        <div className="w-100 mb-3 p-4 bg-white rounded shadow-sm border-start border-primary border-4">
          <h2 className="fw-bold text-dark m-0 d-flex align-items-center flex-wrap gap-2">
            <i className="bi bi-speedometer2 text-primary me-2"></i>
            <span>LMS Administrator Workspace</span>
          </h2>

          <p
            className="text-muted small mb-0 mt-2 ps-1 ps-md-4"
            style={{ paddingLeft: '2rem' }}
          >
            System-wide analytics, directory auditing, and database monitors.
          </p>
        </div>

        {/* Quick Action Buttons - Handled layout gaps properly for responsiveness */}
        <div className="w-100 mb-4 p-3 bg-white rounded shadow-sm d-flex align-items-center justify-content-between flex-wrap gap-3">
          <span className="text-secondary small fw-bold text-uppercase tracking-wider">
            <i className="bi bi-sliders me-1"></i>
            Quick Management:
          </span>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            <Link
              to="/admin/users"
              className="btn btn-outline-primary btn-sm px-3 py-2 rounded-2 fw-semibold d-flex align-items-center shadow-sm text-decoration-none"
            >
              <i className="bi bi-people-fill me-2"></i>
              Manage Users
            </Link>

            <Link
              to="/admin/courses"
              className="btn btn-outline-secondary btn-sm px-3 py-2 rounded-2 fw-semibold d-flex align-items-center shadow-sm text-decoration-none"
            >
              <i className="bi bi-journals me-2"></i>
              Audit Courses
            </Link>

            <Link
              to="/admin/enrollments"
              className="btn btn-primary btn-sm px-3 py-2 rounded-2 fw-semibold d-flex align-items-center shadow-sm text-white text-decoration-none"
            >
              <i className="bi bi-person-check-fill me-2"></i>
              Manage Enrollments
            </Link>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-danger shadow-sm" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
        )}

        {/* Loading State / Main View */}
        {loading ? (
          <Loader message="Querying micro-service aggregates..." />
        ) : (
          <div className="w-100">
            {/* Analytics Summary Cards */}
            <AnalyticsCards stats={stats} />

            {/* Dashboard Analytics Section */}
            <div className="row g-4 mb-4">
              <div className="col-12">
                <Charts stats={stats} />
              </div>

              {/* System Overview Card */}
              <div className="col-12 col-lg-6">
                <div className="card shadow-sm border-0 bg-white p-4 h-100 d-flex flex-column justify-content-between">
                  <div>
                    <h5 className="fw-bold text-indigo-600 mb-3">
                      Enterprise LMS Architecture
                    </h5>

                    <p className="text-muted small leading-relaxed">
                      This full-stack MERN dashboard implements secure JWT
                      authentication, bcrypt password protection, Mongoose
                      database models, and role-based route authorization.
                    </p>
                  </div>

                  <div className="my-4">
                    <h6 className="fw-bold text-dark small mb-2">
                      Technical Capabilities:
                    </h6>

                    <ul className="list-unstyled mb-0">
                      <li className="d-flex align-items-center mb-1 text-muted small">
                        <i className="bi bi-check2-circle text-success me-2"></i>
                        Express server controllers routing
                      </li>

                      <li className="d-flex align-items-center mb-1 text-muted small">
                        <i className="bi bi-check2-circle text-success me-2"></i>
                        Database state persistence models
                      </li>

                      <li className="d-flex align-items-center text-muted small">
                        <i className="bi bi-check2-circle text-success me-2"></i>
                        Recharts visual analytics integration
                      </li>
                    </ul>
                  </div>

                  <Link
                    to="/admin/reports"
                    className="btn btn-primary w-100 text-uppercase fw-bold text-white small py-2 shadow-sm"
                  >
                    <i className="bi bi-file-earmark-bar-graph me-2"></i>
                    System Report
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;