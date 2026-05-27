import React from 'react';
import { formatDate } from '../../utils/helpers';

/**
 * @component UserTable
 * @description Displays system users in a tabular format with role-based styling and delete action
 */
export const UserTable = ({ users = [], onDeleteUser }) => {
  return (
    <div
      className="card shadow-sm border-0 bg-white overflow-hidden"
      style={{ borderRadius: '12px' }}
    >
      {/* Table header */}
      <div className="card-header bg-white border-0 py-3">
        <h5 className="fw-bold text-dark mb-0">
          System User Database
        </h5>
      </div>

      {/* Table wrapper - Enforced strict horizontal scroll boundaries */}
      <div className="table-responsive w-100" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table className="table table-hover align-middle mb-0">

          {/* Table head - Fixed column widths with text-nowrap */}
          <thead
            className="table-light text-uppercase font-bold text-nowrap"
            style={{ fontSize: '0.75rem' }}
          >
            <tr>
              <th scope="col" className="ps-4" style={{ minWidth: '220px' }}>
                Name
              </th>
              <th scope="col" style={{ minWidth: '220px' }}>
                Email Address
              </th>
              <th scope="col" style={{ minWidth: '130px' }}>
                Role
              </th>
              <th scope="col" style={{ minWidth: '160px' }}>
                Registered On
              </th>
              <th scope="col" className="text-end pe-4" style={{ minWidth: '100px' }}>
                Actions
              </th>
            </tr>
          </thead>

          {/* Table body */}
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-4 text-muted small"
                >
                  No registered users in database logs.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u._id}>

                  {/* User identity cell */}
                  <td className="ps-4">
                    <div className="d-flex align-items-center" style={{ whiteSpace: 'normal' }}>

                      <div
                        className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold me-3 flex-shrink-0"
                        style={{ width: '38px', height: '38px' }}
                      >
                        {u.name ? u.name.charAt(0).toUpperCase() : '?'}
                      </div>

                      <div style={{ minWidth: 0 }}>
                        <span className="fw-bold d-block text-dark text-truncate" style={{ maxWidth: '160px' }} title={u.name}>
                          {u.name}
                        </span>

                        <small
                          className="text-muted d-block"
                          style={{ fontSize: '0.7rem' }}
                        >
                          ID: {u._id}
                        </small>
                      </div>

                    </div>
                  </td>

                  {/* Email Cell with nowrap protection */}
                  <td className="text-nowrap text-dark">
                    {u.email}
                  </td>

                  {/* Role badge */}
                  <td className="text-nowrap">
                    <span
                      className={`badge text-uppercase p-2 ${
                        u.role === 'admin'
                          ? 'bg-danger-subtle text-danger'
                          : u.role === 'instructor'
                          ? 'bg-success-subtle text-success'
                          : 'bg-primary-subtle text-primary'
                      }`}
                      style={{ fontSize: '0.65rem' }}
                    >
                      {u.role}
                    </span>
                  </td>

                  {/* Registration date */}
                  <td className="small text-muted text-nowrap">
                    {formatDate(u.createdAt)}
                  </td>

                  {/* Actions column protected from shrinking */}
                  <td className="text-end pe-4 text-nowrap">
                    <button
                      className="btn btn-outline-danger btn-sm d-inline-flex align-items-center justify-content-center"
                      style={{ width: '32px', height: '32px' }}
                      title="De-register / Delete User"
                      onClick={() => onDeleteUser(u._id)}
                      disabled={u.role === 'admin'} // Prevent admin deletion
                    >
                      <i className="bi bi-trash-fill"></i>
                    </button>
                  </td>

                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default UserTable;