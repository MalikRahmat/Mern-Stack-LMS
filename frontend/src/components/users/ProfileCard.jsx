import React from 'react';

/**
 * @component ProfileCard
 * @description Displays user profile information with real-time database-driven avatar support
 */
export const ProfileCard = ({ user }) => {
  if (!user) return null;

  // Base URL pointing to the Node.js Express server backend where resources are statically served
  const backendBaseUrl = 'http://localhost:5000/';

  return (
    <div 
      className="card shadow border-0 p-4 text-center bg-white h-100" 
      style={{ borderRadius: '16px' }}
    >
      <div className="card-body">

        {/* Profile Avatar Container Section */}
        <div className="position-relative d-inline-block mb-4">
          
          {user.profilePicture ? (
            /* Rendered Image Asset when a valid profile picture path exists inside backend registry */
            <img
              src={`${backendBaseUrl}${user.profilePicture}`}
              alt={`${user.name}'s Profile Portfolio`}
              className="rounded-circle object-fit-cover border border-3 border-light shadow-sm mx-auto d-block"
              style={{ width: '96px', height: '96px' }}
              onError={(e) => {
                // Failsafe error breakdown block to safeguard rendering if asset is removed from the filesystem
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/96";
              }}
            />
          ) : (
            /* Fallback Dynamic Circle Component using String Character Slicing */
            <div
              className="bg-primary text-white rounded-circle mx-auto d-flex align-items-center justify-content-center fw-bold shadow-sm"
              style={{ width: '96px', height: '96px', fontSize: '2.5rem' }}
            >
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          )}

          {/* Active green status layer token node indicator */}
          <span
            className="position-absolute bottom-0 end-0 bg-success border border-white border-2 rounded-circle p-2"
            title="Active Session Authenticated"
          ></span>

        </div>

        {/* User Account Identity Meta Descriptions */}
        <h3 className="fw-bold text-dark mb-1">
          {user.name}
        </h3>

        <p className="text-muted small mb-3">
          {user.email}
        </p>

        {/* Dynamic Authorization Role badge mapped exactly into core parameters layout */}
        <div className="d-flex justify-content-center mb-4">
          <span
            className="badge bg-primary-subtle text-primary text-uppercase px-3 py-2 fw-bold"
            style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}
          >
            {user.role} Portal Member
          </span>
        </div>

        <hr className="my-3 text-muted opacity-25" />

        {/* Systematic Verified Authorization Trace Layers */}
        <div className="text-start mt-4">

          <h6 className="fw-bold mb-3 text-dark" style={{ fontSize: '0.9rem' }}>
            System Access Details:
          </h6>

          <div className="d-flex justify-content-between py-2 border-bottom text-muted small">
            <span>Authentication Token</span>
            <span
              className="fw-bold text-dark text-truncate ms-3"
              style={{ maxWidth: '150px' }}
              title="Active JWT Session"
            >
              Active JWT Session
            </span>
          </div>

          <div className="d-flex justify-content-between py-2 border-bottom text-muted small">
            <span>Security Status</span>
            <span className="fw-bold text-success d-flex align-items-center">
              <i className="bi bi-shield-fill-check me-1"></i>
              Role-Enforced
            </span>
          </div>

          <div className="d-flex justify-content-between py-2 text-muted small">
            <span>Unique Mapping ID</span>
            <span className="fw-medium text-dark font-monospace">
              {user._id ? user._id.slice(-6).toUpperCase() : 'N/A'}
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProfileCard;