import React, { useEffect, useState } from 'react';

import enrollmentService from '../../services/enrollmentService';
import DashboardLayout from '../../layouts/DashboardLayout';

const ManageEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] =
    useState(false);

  /**
   * Fetch all enrollment records
   */
  const fetchEnrollments = async () => {
    try {
      setLoading(true);

      const res =
        await enrollmentService.getAllEnrollments();

      setEnrollments(res || []);
    } catch (error) {
      console.error(
        'Error fetching institutional registry:',
        error
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch initial page data
   */
  const fetchUsersAndEnrollments = () => {
    fetchEnrollments();
  };

  useEffect(() => {
    fetchUsersAndEnrollments();

    // eslint-disable-next-line
  }, []);

  /**
   * Handle enrollment status updates
   */
  const handleStatusUpdate = async (
    id,
    newStatus
  ) => {
    const confirmation = window.confirm(
      `Are you certain you want to change this enrollment status to ${newStatus.toUpperCase()}?`
    );

    if (!confirmation) {
      return;
    }

    try {
      setActionLoading(true);

      await enrollmentService.updateEnrollmentStatus(
        id,
        newStatus
      );

      // Update local UI state instantly
      setEnrollments((prev) =>
        prev.map((item) =>
          item._id === id
            ? {
                ...item,
                status: newStatus
              }
            : item
        )
      );
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          'Failed to update academic application status.'
      );
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Delete enrollment record
   */
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      'Are you absolutely sure you want to hard delete this enrollment log? This removes records permanently.'
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await enrollmentService.deleteEnrollment(
        id
      );

      setEnrollments((prev) =>
        prev.filter(
          (item) => item._id !== id
        )
      );
    } catch (error) {
      console.error(error);

      alert(
        'Failed to delete enrollment file.'
      );
    }
  };

  /**
   * Calculate live enrollment metrics
   */
  const pendingRequestsCount =
    enrollments.filter(
      (e) => e.status === 'pending'
    ).length;

  const approvedCount =
    enrollments.filter(
      (e) => e.status === 'approved'
    ).length;

  /**
   * Render loading state
   */
  if (loading) {
    return (
      <div className="text-center py-5">
        <div
          className="spinner-border text-primary"
          role="status"
        />

        <p className="text-muted small mt-2">
          Loading core registration
          indexes...
        </p>
      </div>
    );
  }

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="row mb-4 align-items-center">
        <div className="col-md-6">
          <h2 className="fw-bold text-dark mb-1">
            Enrollment Authorization
          </h2>

          <p className="text-muted small mb-0">
            Approve or audit global
            application requests and live
            course access control logs.
          </p>
        </div>

        {/* Real-Time Enrollment Metrics */}
        <div className="col-md-6 d-flex gap-3 justify-content-md-end mt-3 mt-md-0">
          <div className="bg-warning-subtle text-warning border-0 px-3 py-2 rounded shadow-sm d-flex align-items-center gap-2">
            <i className="bi bi-exclamation-circle-fill fs-5"></i>

            <div>
              <div className="fw-bold lh-1">
                {pendingRequestsCount}
              </div>

              <small
                className="text-muted"
                style={{
                  fontSize: '0.65rem'
                }}
              >
                Pending Review
              </small>
            </div>
          </div>

          <div className="bg-success-subtle text-success border-0 px-3 py-2 rounded shadow-sm d-flex align-items-center gap-2">
            <i className="bi bi-check-circle-fill fs-5"></i>

            <div>
              <div className="fw-bold lh-1">
                {approvedCount}
              </div>

              <small
                className="text-muted"
                style={{
                  fontSize: '0.65rem'
                }}
              >
                Active Admissions
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Enrollment Registry Table */}
      <div
        className="card shadow-sm border-0 bg-white"
        style={{ borderRadius: '12px' }}
      >
        {/* Card Header */}
        <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
          <h5 className="fw-bold mb-0 text-secondary">
            <i className="bi bi-shield-lock-fill me-2 text-primary"></i>

            Access Matrix Log
          </h5>

          {actionLoading && (
            <span className="spinner-border spinner-border-sm text-primary"></span>
          )}
        </div>

        {/* Enrollment Table */}
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead
              className="table-light text-uppercase"
              style={{
                fontSize: '0.72rem',
                letterSpacing: '0.5px'
              }}
            >
              <tr>
                <th className="ps-3">
                  Student Identity
                </th>

                <th>
                  Course Mapping
                </th>

                <th>
                  Category
                </th>

                <th className="text-center">
                  Live Progress
                </th>

                <th className="text-center">
                  State Status
                </th>

                <th className="text-end pe-3">
                  Governance Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {enrollments.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-5 text-muted"
                  >
                    <i className="bi bi-folder-x fs-2 d-block text-secondary mb-2"></i>

                    No enrollment manifests
                    loaded inside this
                    terminal node.
                  </td>
                </tr>
              ) : (
                enrollments.map((e) => (
                  <tr key={e._id}>
                    {/* Student Information */}
                    <td className="ps-3">
                      <div className="fw-bold text-dark">
                        <i className="bi bi-person-circle me-2 text-secondary"></i>

                        {e.student?.name ||
                          'System Dead Node'}
                      </div>

                      <div
                        className="text-muted small ps-4"
                        style={{
                          fontSize: '0.75rem'
                        }}
                      >
                        {
                          e.student
                            ?.email
                        }
                      </div>
                    </td>

                    {/* Course Information */}
                    <td>
                      <span className="fw-semibold text-primary-dark">
                        {e.course?.title ||
                          'Course Index Dropped'}
                      </span>
                    </td>

                    {/* Course Category */}
                    <td>
                      <span
                        className="badge bg-light text-secondary border text-uppercase"
                        style={{
                          fontSize: '0.65rem'
                        }}
                      >
                        {e.course
                          ?.category ||
                          'General'}
                      </span>
                    </td>

                    {/* Enrollment Progress */}
                    <td className="text-center">
                      <span
                        className={`badge fw-semibold ${
                          e.progress >= 80
                            ? 'bg-success-subtle text-success'
                            : e.progress >=
                              40
                            ? 'bg-warning-subtle text-warning-dark text-dark'
                            : 'bg-danger-subtle text-danger'
                        }`}
                        style={{
                          fontSize: '0.75rem'
                        }}
                      >
                        {e.progress || 0}%
                      </span>
                    </td>

                    {/* Enrollment Status */}
                    <td className="text-center">
                      <span
                        className={`badge text-uppercase p-2 rounded ${
                          e.status ===
                          'approved'
                            ? 'bg-success text-white'
                            : e.status ===
                              'rejected'
                            ? 'bg-danger text-white'
                            : 'bg-warning text-dark'
                        }`}
                        style={{
                          fontSize: '0.65rem',
                          fontWeight:
                            '700'
                        }}
                      >
                        <i
                          className={`bi ${
                            e.status ===
                            'approved'
                              ? 'bi-patch-check-fill'
                              : e.status ===
                                'rejected'
                              ? 'bi-x-circle-fill'
                              : 'bi-hourglass-split'
                          } me-1`}
                        ></i>

                        {e.status ||
                          'pending'}
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td className="text-end pe-3">
                      <div className="d-flex gap-1 justify-content-end">
                        {e.status ===
                          'pending' && (
                          <>
                            <button
                              className="btn btn-success btn-sm px-2 py-1 fw-semibold"
                              style={{
                                fontSize:
                                  '0.7rem'
                              }}
                              onClick={() =>
                                handleStatusUpdate(
                                  e._id,
                                  'approved'
                                )
                              }
                              disabled={
                                actionLoading
                              }
                            >
                              <i className="bi bi-check-lg me-1"></i>

                              Approve
                            </button>

                            <button
                              className="btn btn-outline-danger btn-sm px-2 py-1"
                              style={{
                                fontSize:
                                  '0.7rem'
                              }}
                              onClick={() =>
                                handleStatusUpdate(
                                  e._id,
                                  'rejected'
                                )
                              }
                              disabled={
                                actionLoading
                              }
                            >
                              <i className="bi bi-x-lg me-1"></i>

                              Reject
                            </button>
                          </>
                        )}

                        {/* Permanent Record Deletion */}
                        <button
                          className="btn btn-link link-danger p-1 ms-2"
                          title="Purge Record"
                          onClick={() =>
                            handleDelete(
                              e._id
                            )
                          }
                        >
                          <i className="bi bi-trash-fill small"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageEnrollments;