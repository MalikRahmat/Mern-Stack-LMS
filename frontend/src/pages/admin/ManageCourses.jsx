import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import DashboardLayout from '../../layouts/DashboardLayout';
import Loader from '../../components/common/Loader';
import courseService from '../../services/courseService';

export const ManageCoursesAdmin = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [msg, setMsg] = useState({
    type: '',
    text: ''
  });

  // Fetch all courses inside the main directory
  const fetchAllCourses = async () => {
    try {
      setLoading(true);
      const data = await courseService.getAllCourses();
      setCourses(data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to download academic records directory.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCourses();
  }, []);

  // Handles dangerous course purging execution
  const handleDeleteCourse = async (id) => {
    const confirmed = window.confirm(
      'Are you absolutely certain you want to audit-delete this course from global listings?'
    );

    if (!confirmed) {
      return;
    }

    try {
      await courseService.deleteCourse(id);
      setMsg({
        type: 'success',
        text: 'Course reviewed and deleted successfully.'
      });
      fetchAllCourses();
    } catch (err) {
      setMsg({
        type: 'danger',
        text: err.response?.data?.message || 'Course deletion aborted.'
      });
    }
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-4">
        <h2 className="fw-bold text-dark">
          Global Syllabus Moderation
        </h2>

        <p className="text-muted small">
          Censor, modify, and audit public educational contents published on Edumern portals.
        </p>
      </div>

      {/* Status Message */}
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
            onClick={() =>
              setMsg({
                type: '',
                text: ''
              })
            }
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
        <Loader message="Querying global database indices..." />
      ) : courses.length === 0 ? (
        /* Empty State */
        <div className="text-center py-5 bg-white border rounded">
          <i
            className="bi bi-journal-x text-muted"
            style={{ fontSize: '3.5rem' }}
          ></i>

          <h4 className="fw-bold text-slate-800 mt-3">
            No active courses published yet
          </h4>

          <p className="text-muted small">
            System catalog database is entirely unpopulated.
          </p>
        </div>
      ) : (
        /* Courses Table */
        <div
          className="card shadow-sm border-0 bg-white overflow-hidden"
          style={{ borderRadius: '12px' }}
        >
          <div className="card-header bg-white border-0 py-3">
            <h5 className="fw-bold text-dark mb-0">
              Academic Catalog Registries
            </h5>
          </div>

          {/* Table Responsive Wrapper Container */}
          <div className="table-responsive w-100" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table className="table table-hover align-middle mb-0">
              <thead
                className="table-light text-uppercase font-bold text-nowrap"
                style={{ fontSize: '0.75rem' }}
              >
                <tr>
                  <th scope="col" className="ps-4" style={{ minWidth: '250px' }}>
                    Course Details
                  </th>
                  <th scope="col" style={{ minWidth: '180px' }}>Instructor</th>
                  <th scope="col" style={{ minWidth: '130px' }}>Category</th>
                  <th scope="col" style={{ minWidth: '90px' }}>Price</th>
                  <th scope="col" className="text-end pe-4" style={{ minWidth: '220px' }}>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {courses.map((c) => (
                  <tr key={c._id}>
                    <td className="ps-4">
                      <div style={{ whiteSpace: 'normal' }}>
                        <span
                          className="fw-bold text-dark d-block text-truncate"
                          style={{ maxWidth: '240px' }}
                          title={c.title}
                        >
                          {c.title}
                        </span>
                        <small className="text-muted d-block mt-1">
                          ID: {c._id}
                        </small>
                      </div>
                    </td>

                    
                    <td className="text-nowrap">
                      <div>
                        <span className="fw-semibold text-slate-800 d-block">
                          {c.instructor?.name || 'Academic Faculty'}
                        </span>
                        <small
                          className="text-muted d-block small"
                          style={{ fontSize: '0.7rem' }}
                        >
                          {c.instructor?.email}
                        </small>
                      </div>
                    </td>

                    <td className="text-nowrap">
                      <span
                        className="badge bg-secondary-subtle text-secondary text-uppercase"
                        style={{ fontSize: '0.65rem' }}
                      >
                        {c.category}
                      </span>
                    </td>

                    <td className="text-nowrap">
                      <span className="fw-bold text-primary">
                        ${c.price}
                      </span>
                    </td>

                    {/* Action Cells: Enforced absolute non-breaking row parameters */}
                    <td className="text-end pe-4 text-nowrap">
                      <div className="d-inline-flex gap-2 justify-content-end align-items-center flex-shrink-0">
                        
                        <Link
                          to={`/course-overview/${c._id}?mode=audit`}
                          className="btn btn-outline-info btn-sm fw-semibold d-inline-flex align-items-center gap-1 text-nowrap"
                          style={{ height: '32px' }}
                        >
                          <i className="bi bi-shield-fill-check"></i>
                          Audit Link
                        </Link>

                        <button
                          className="btn btn-outline-danger btn-sm d-inline-flex align-items-center gap-1 text-nowrap"
                          style={{ height: '32px' }}
                          onClick={() => handleDeleteCourse(c._id)}
                        >
                          <i className="bi bi-trash-fill"></i>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ManageCoursesAdmin;