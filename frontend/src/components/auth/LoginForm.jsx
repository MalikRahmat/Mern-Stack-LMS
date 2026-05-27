import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail } from '../../utils/validators';

/**
 * LoginForm Component
 * Provides a secure login form with validation, error handling,
 * and role-based navigation after successful authentication.
 */
export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, message } = useAuth();
  const navigate = useNavigate();

  /**
   * Handles form submission and login process.
   * Validates input, sends login request, and redirects based on user role.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Validate required fields
    if (!email || !password) {
      setFormError('Please fill out all mandatory fields.');
      return;
    }

    // Validate email format
    if (!validateEmail(email)) {
      setFormError('Please provide a valid email format.');
      return;
    }

    setSubmitting(true);
    try {
      console.log("Sending login request for:", email);
      const res = await login(email, password);

      console.log("Response received from login context:", res);

      // Extract user object from response
      const fetchedUser = res?.data?.user || res?.user || res;

      console.log("Extracted User Object:", fetchedUser);
      console.log("User Role found:", fetchedUser?.role);

      if (fetchedUser && fetchedUser.role) {
        const userRole = fetchedUser.role.toLowerCase();

        // Redirect user based on role
        setTimeout(() => {
          if (userRole === 'admin') {
            navigate('/admin/dashboard');
          } else if (userRole === 'instructor') {
            navigate('/instructor/dashboard');
          } else if (userRole === 'student') {
            navigate('/student/dashboard');
          } else {
            setFormError(`Role '${userRole}' is not recognized by frontend routing.`);
          }
        }, 1500);
      } else {
        setFormError("Login succeeded, but no user role was returned from backend.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setFormError(err.response?.data?.message || err.message || 'Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card shadow-lg border-0 p-4" style={{ borderRadius: '16px' }}>
      <div className="card-body text-center">
        <div className="mb-3">
          <i className="bi bi-shield-lock-fill text-primary" style={{ fontSize: '3rem' }}></i>
        </div>
        <h3 className="card-title fw-bold mb-4">Account Login</h3>

        {/* Error message alert */}
        {formError && (
          <div className="alert alert-danger alert-dismissible fade show text-start small py-2" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {formError}
          </div>
        )}

        {/* Success message alert */}
        {message && (
          <div className="alert alert-success alert-dismissible fade show text-start small py-2" role="alert">
            <i className="bi bi-check-circle-fill me-2"></i>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="text-start">
          {/* Email Field */}
          <div className="mb-3">
            <label className="form-label small fw-bold text-muted">Email Address</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-envelope text-muted"></i>
              </span>
              <input
                type="email"
                className="form-control bg-light border-start-0"
                placeholder="example@lms.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label className="form-label small fw-bold text-muted">Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-key text-muted"></i>
              </span>
              <input
                type="password"
                className="form-control bg-light border-start-0"
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
                required
              />
            </div>
            <div className="form-text small text-muted text-end mt-1">
              Hint: 123456 (for seeded users)
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Logging in...
              </>
            ) : (
              <>
                <i className="bi bi-box-arrow-in-right me-2"></i>Sign In
              </>
            )}
          </button>
        </form>

        {/* Registration Link */}
        <div className="mt-4 pt-2 border-top text-center text-muted small">
          Don't have an account yet? <Link to="/register" className="text-decoration-none text-primary fw-bold">Sign Up Free</Link>
        </div>

        {/* Quick-Test Accounts */}
        <div className="mt-3 bg-light p-2 rounded text-start" style={{ fontSize: '0.75rem' }}>
          <span className="fw-bold d-block text-dark mb-1">Accounts to Quick-Test:</span>
          <div>🧑‍🎓 Student: <code>student@lms.com</code> (pwd: 123456)</div>
          <div>👨‍🏫 Instructor: <code>instructor@lms.com</code> (pwd: 123456)</div>
          <div>🛡️ Admin: <code>admin@lms.com</code> (pwd: 123456)</div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
