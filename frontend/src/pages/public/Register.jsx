import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import MainLayout from "../../layouts/MainLayout";

const Register = () => {
  const navigate = useNavigate();

  /**
   * Registration form state
   * Includes optional phone field for extended user profile support
   */
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "", // Optional field
    password: "",
    confirmPassword: ""
  });

  // UI state management
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /**
   * Handles input field updates dynamically
   */
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  /**
   * Handles user registration submission
   * Validates password match before API request
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Client-side validation: password confirmation check
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      // API call to register new student account
      await authService.register(
        formData.name,
        formData.email,
        formData.password,
        "student", // Role is enforced as student for portal security
        formData.phone // Optional phone number field
      );

      setSuccess("Account registered successfully! Redirecting to login...");

      // Reset form after successful registration
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
      });

      // Redirect user to login page after short delay
      setTimeout(() => {
        navigate("/login");
      }, 2500);

    } catch (err) {
      // Handle API or network errors gracefully
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-6 col-lg-5">
              <div className="card shadow-sm border-0 p-4">

                {/* Header Section */}
                <div className="text-center mb-4">
                  <i className="bi bi-person-plus-fill text-success fs-1"></i>
                  <h3 className="fw-bold mt-2">Student Registration</h3>
                  <p className="text-muted small">
                    Create your free student portal account.
                  </p>
                </div>

                {/* Alert Messages */}
                {error && (
                  <div className="alert alert-danger small p-2" role="alert">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="alert alert-success small p-2" role="alert">
                    {success}
                  </div>
                )}

                {/* Registration Form */}
                <form onSubmit={handleSubmit} autoComplete="off">

                  {/* Full Name Field */}
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label fw-semibold">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      autoComplete="none"
                      required
                    />
                  </div>

                  {/* Email Field */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-semibold">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="none"
                      required
                    />
                  </div>

                  {/* Phone Field (Optional) */}
                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label fw-semibold">
                      Phone Number <span className="text-muted fw-normal small">(Optional)</span>
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="phone"
                      placeholder="e.g., +923001234567"
                      value={formData.phone}
                      onChange={handleChange}
                      autoComplete="none"
                    />
                  </div>

                  {/* Password Field */}
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label fw-semibold">
                      Password
                    </label>
                    <div className="position-relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control pe-5"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        autoComplete="new-password"
                        required
                      />
                      <i
                        className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: "absolute",
                          right: "15px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                          color: "#6c757d",
                          zIndex: 5
                        }}
                      ></i>
                    </div>
                  </div>

                  {/* Confirm Password Field */}
                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label fw-semibold">
                      Confirm Password
                    </label>
                    <div className="position-relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className="form-control pe-5"
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        autoComplete="new-password"
                        required
                      />
                      <i
                        className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"}`}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{
                          position: "absolute",
                          right: "15px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          cursor: "pointer",
                          color: "#6c757d",
                          zIndex: 5
                        }}
                      ></i>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-success w-100 fw-semibold"
                    disabled={loading}
                  >
                    {loading ? "Registering Portal..." : "Register"}
                  </button>
                </form>

                {/* Login Redirect */}
                <div className="text-center mt-3">
                  <span className="small text-muted">
                    Already have an account?
                  </span>
                  <Link
                    to="/login"
                    className="small fw-bold text-primary text-decoration-none"
                  >
                    {" "}Login here
                  </Link>
                </div>

                {/* Info Note */}
                <div className="bg-light p-2 rounded mt-3 text-center border">
                  <small className="text-muted d-block" style={{ fontSize: "0.75rem" }}>
                    <i className="bi bi-info-circle me-1"></i>
                    Instructors or Admins must contact the central IT desk for portal generation.
                  </small>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Register;