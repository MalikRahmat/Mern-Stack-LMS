import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail, validatePassword } from '../../utils/validators';

/**
 * RegisterForm Component
 * Provides a secure registration form with validation, error handling,
 * and role-based navigation after successful account creation.
 */
export const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register, message } = useAuth();
  const navigate = useNavigate();

  /**
   * Handles form submission and registration process.
   * Validates input, sends registration request, and redirects based on user role.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Validate required fields
    if (!name || !email || !password) {
      setFormError('Please fill out all mandatory fields.');
      return;
    }

    // Validate email format
    if (!validateEmail(email)) {
      setFormError('Please provide a valid email format.');
      return;
    }

    // Validate password strength
    if (!validatePassword(password)) {
      setFormError('Secure passwords must contain at least 6 characters.');
      return;
    }

    setSubmitting(true);
    try {
      const userData = await register(name, email, password, role);

      // Delay navigation so success alert is visible
      setTimeout(() => {
        if (userData.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (userData.role === 'instructor') {
          navigate('/instructor/dashboard');
        } else {
          navigate('/student/dashboard');
        }
      }, 1500);
    } catch (err) {
      setFormError(
        err.response?.data?.message ||
          'Conflict: Email already registered in the system.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card shadow-lg border-0 p-4" style={{ borderRadius: '16px' }}>
      <div className="card-body">
        {/* Header Section */}
        <div className="text-center mb-3">
          <i className="bi bi-person-plus-fill text-primary" style={{ fontSize: '3rem' }}></i>
          <h3 className="card-title fw-bold">Create Account</h3>
          <p className="text-muted small">Join our dynamic learning community today</p>
        </div>

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

        {/* Registration Form */}
        <form onSubmit={handleSubmit}>
          {/* Full Name Field */}
          <div className="mb-3">
            <label className="form-label small fw-bold text-muted">Full Name</label>
            <div className="input-group">
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-person text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control bg-light border-start-0"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={submitting}
                required
              />
            </div>
          </div>

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
          <div className="mb-3">
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
            <div className="form-text small text-muted">Must be at least 6 characters.</div>
          </div>

          {/* Role Selection */}
          <div className="mb-4">
            <label className="form-label small fw-bold text-muted">Register As</label>
            <div className="d-flex gap-3 mt-1">
              <div className="form-check flex-fill p-3 border rounded bg-light text-center cursor-pointer">
                <input
                  className="form-check-input"
                  type="radio"
                  name="role"
                  id="roleStudent"
                  value="student"
                  checked={role === 'student'}
                  onChange={() => setRole('student')}
                  disabled={submitting}
                />
                <label className="form-check-label fw-bold small flex-fill cursor-pointer" htmlFor="roleStudent">
                  🧑‍🎓 Student
                </label>
              </div>
              <div className="form-check flex-fill p-3 border rounded bg-light text-center cursor-pointer">
                <input
                  className="form-check-input"
                  type="radio"
                  name="role"
                  id="roleInstructor"
                  value="instructor"
                  checked={role === 'instructor'}
                  onChange={() => setRole('instructor')}
                  disabled={submitting}
                />
                <label className="form-check-label fw-bold small flex-fill cursor-pointer" htmlFor="roleInstructor">
                  👨‍🏫 Instructor
                </label>
              </div>
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
                Processing Registration...
              </>
            ) : (
              <>
                <i className="bi bi-person-check-fill me-2"></i>Sign Up
              </>
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-4 pt-2 border-top text-center text-muted small">
          Already have an account? <Link to="/login" className="text-decoration-none text-primary fw-bold">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
