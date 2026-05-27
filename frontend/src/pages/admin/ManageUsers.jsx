import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import UserTable from '../../components/users/UserTable';
import Loader from '../../components/common/Loader';
import userService from '../../services/userService';

export const ManageUsers = () => {
  // User management states
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState({
    type: '',
    text: '',
  });

  // Add instructor form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [instructorData, setInstructorData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  // Replace instructor form state
  const [showReplaceForm, setShowReplaceForm] = useState(false);
  const [replaceData, setReplaceData] = useState({
    oldInstructorId: '',
    newInstructorId: '',
  });

  // Administrative password reset form state
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetPasswordData, setResetPasswordData] = useState({
    userId: '',
    newPassword: '',
  });

  // Fetch all system users
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const data = await userService.getAllUsers();

      setUsers(data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to fetch system users.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter instructor accounts
  const instructorsList = users.filter(
    (user) => user.role === 'instructor'
  );

  // Delete user account
  const handleDeleteUser = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to permanently delete this user account?'
    );

    if (!confirmed) {
      return;
    }

    try {
      await userService.deleteUser(id);

      setMessage({
        type: 'success',
        text: 'User account deleted successfully.',
      });

      fetchUsers();
    } catch (err) {
      setMessage({
        type: 'danger',
        text:
          err.response?.data?.message ||
          'Failed to delete user account.',
      });
    }
  };

  // Create new instructor account
  const handleAddInstructor = async (e) => {
    e.preventDefault();

    try {
      await userService.createInstructor(instructorData);

      setMessage({
        type: 'success',
        text: 'Instructor account created successfully.',
      });

      setShowAddForm(false);

      setInstructorData({
        name: '',
        email: '',
        password: '',
        phone: '',
      });

      fetchUsers();
    } catch (err) {
      setMessage({
        type: 'danger',
        text:
          err.response?.data?.message ||
          'Failed to create instructor account.',
      });
    }
  };

  // Reassign instructor courses
  const handleReplaceInstructor = async (e) => {
    e.preventDefault();

    if (
      replaceData.oldInstructorId ===
      replaceData.newInstructorId
    ) {
      alert(
        'Old and new instructors cannot be the same account.'
      );

      return;
    }

    try {
      const response = await userService.replaceInstructor(
        replaceData
      );

      setMessage({
        type: 'success',
        text:
          response.message ||
          'Instructor courses reassigned successfully.',
      });

      setShowReplaceForm(false);

      setReplaceData({
        oldInstructorId: '',
        newInstructorId: '',
      });

      fetchUsers();
    } catch (err) {
      setMessage({
        type: 'danger',
        text:
          err.response?.data?.message ||
          'Failed to reassign instructor courses.',
      });
    }
  };

  // Reset user password by administrator
  const handleAdminResetPassword = async (e) => {
    e.preventDefault();

    try {
      const response = userService.resetPassword
        ? await userService.resetPassword(resetPasswordData)
        : await import('../../api/axios').then((module) =>
            module.default.post(
              '/users/reset-password',
              resetPasswordData
            )
          );

      setMessage({
        type: 'success',
        text:
          response.data?.message ||
          response.message ||
          'User password updated successfully.',
      });

      setShowResetForm(false);

      setResetPasswordData({
        userId: '',
        newPassword: '',
      });
    } catch (err) {
      setMessage({
        type: 'danger',
        text:
          err.response?.data?.message ||
          'Failed to reset user password.',
      });
    }
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-dark">
            User Account Management
          </h2>

          <p className="text-muted small mb-0">
            Manage students, instructors, and administrative
            accounts.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="d-flex gap-2 flex-wrap">
          <button
            className="btn btn-dark btn-sm fw-semibold shadow-sm"
            onClick={() => setShowResetForm(!showResetForm)}
          >
            <i className="bi bi-key-fill me-1"></i>
            Reset Password
          </button>

          <button
            className="btn btn-warning btn-sm fw-semibold shadow-sm"
            onClick={() => setShowReplaceForm(!showReplaceForm)}
          >
            <i className="bi bi-arrow-left-right me-1"></i>
            Replace Instructor
          </button>

          <button
            className="btn btn-primary btn-sm fw-semibold shadow-sm"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <i className="bi bi-person-plus-fill me-1"></i>
            Add Instructor
          </button>
        </div>
      </div>

      {/* Global Status Messages */}
      {message.text && (
        <div
          className={`alert alert-${message.type} alert-dismissible fade show`}
          role="alert"
        >
          <i className="bi bi-info-circle-fill me-2"></i>

          {message.text}

          <button
            type="button"
            className="btn-close"
            onClick={() =>
              setMessage({
                type: '',
                text: '',
              })
            }
          ></button>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      )}

      {/* Administrative Password Reset Form */}
      {showResetForm && (
        <div
          className="card shadow-sm border-0 p-4 mb-4 bg-light"
          style={{ borderLeft: '4px solid #212529' }}
        >
          <h5 className="fw-bold text-dark mb-2">
            <i className="bi bi-shield-lock me-2"></i>
            Administrative Password Reset
          </h5>

          <p className="text-muted small">
            Reset user account credentials when access recovery
            is required.
          </p>

          <form
            onSubmit={handleAdminResetPassword}
            className="row g-3 align-items-end"
          >
            <div className="col-md-5">
              <label className="form-label small fw-semibold">
                Select User Account
              </label>

              <select
                className="form-select form-select-sm"
                value={resetPasswordData.userId}
                onChange={(e) =>
                  setResetPasswordData({
                    ...resetPasswordData,
                    userId: e.target.value,
                  })
                }
                required
              >
                <option value="">
                  Select User...
                </option>

                {users.map((user) => (
                  <option
                    key={user._id}
                    value={user._id}
                  >
                    {user.name} (
                    {user.role.toUpperCase()} -{' '}
                    {user.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label small fw-semibold">
                New Password
              </label>

              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Minimum 6 characters"
                value={resetPasswordData.newPassword}
                onChange={(e) =>
                  setResetPasswordData({
                    ...resetPasswordData,
                    newPassword: e.target.value,
                  })
                }
                required
                minLength={6}
              />
            </div>

            <div className="col-md-3 d-flex gap-2 justify-content-end">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setShowResetForm(false)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-dark btn-sm fw-semibold"
              >
                Apply Reset
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Instructor Form */}
      {showAddForm && (
        <div className="card shadow-sm border-0 p-4 mb-4 bg-light">
          <h5 className="fw-bold text-primary mb-3">
            <i className="bi bi-person-workspace me-2"></i>
            Create Instructor Account
          </h5>

          <form
            onSubmit={handleAddInstructor}
            className="row g-3"
          >
            <div className="col-md-3">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Full Name"
                value={instructorData.name}
                onChange={(e) =>
                  setInstructorData({
                    ...instructorData,
                    name: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="col-md-3">
              <input
                type="email"
                className="form-control form-control-sm"
                placeholder="Email Address"
                value={instructorData.email}
                onChange={(e) =>
                  setInstructorData({
                    ...instructorData,
                    email: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="col-md-3">
              <input
                type="password"
                className="form-control form-control-sm"
                placeholder="Temporary Password"
                value={instructorData.password}
                onChange={(e) =>
                  setInstructorData({
                    ...instructorData,
                    password: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="col-md-3">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Phone Number (Optional)"
                value={instructorData.phone}
                onChange={(e) =>
                  setInstructorData({
                    ...instructorData,
                    phone: e.target.value,
                  })
                }
              />
            </div>

            <div className="col-12 d-flex gap-2 justify-content-end">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary btn-sm px-4"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Replace Instructor Form */}
      {showReplaceForm && (
        <div
          className="card shadow-sm border-0 p-4 mb-4 bg-light"
          style={{ borderLeft: '4px solid #ffc107' }}
        >
          <h5 className="fw-bold text-warning mb-2">
            <i className="bi bi-shield-shaded me-2"></i>
            Reassign Instructor Courses
          </h5>

          <p className="text-muted small">
            Transfer all assigned courses from one instructor
            account to another.
          </p>

          <form
            onSubmit={handleReplaceInstructor}
            className="row g-3 align-items-end"
          >
            <div className="col-md-4">
              <label className="form-label small fw-semibold">
                Current Instructor
              </label>

              <select
                className="form-select form-select-sm"
                value={replaceData.oldInstructorId}
                onChange={(e) =>
                  setReplaceData({
                    ...replaceData,
                    oldInstructorId: e.target.value,
                  })
                }
                required
              >
                <option value="">
                  Select Instructor...
                </option>

                {instructorsList.map((instructor) => (
                  <option
                    key={instructor._id}
                    value={instructor._id}
                  >
                    {instructor.name} (
                    {instructor.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label small fw-semibold">
                New Instructor
              </label>

              <select
                className="form-select form-select-sm"
                value={replaceData.newInstructorId}
                onChange={(e) =>
                  setReplaceData({
                    ...replaceData,
                    newInstructorId: e.target.value,
                  })
                }
                required
              >
                <option value="">
                  Select Instructor...
                </option>

                {instructorsList.map((instructor) => (
                  <option
                    key={instructor._id}
                    value={instructor._id}
                  >
                    {instructor.name} (
                    {instructor.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4 d-flex gap-2 justify-content-end">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setShowReplaceForm(false)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-warning btn-sm fw-semibold"
              >
                Reassign Courses
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users Data Table */}
      {loading ? (
        <Loader message="Loading system users..." />
      ) : (
        <div className="row">
          <div className="col-12">
            <UserTable
              users={users}
              onDeleteUser={handleDeleteUser}
            />
          </div>
        </div>
      )}
    </DashboardLayout>
  )
};

export default ManageUsers;