import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import MainLayout from "../../layouts/MainLayout";
import enrollmentService from "../../services/enrollmentService";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Added loading state constraint

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Authenticate user using auth context
      const userData = await login(formData.email, formData.password);

      // Extract role safely from response structure variants
      const userRole = userData?.role || userData?.user?.role;

      // Check if there is a pending enrollment inside browser state
      const pendingCourse = localStorage.getItem("pendingEnrollment");

      // Auto-enroll after login if pending enrollment context key exists
      if (pendingCourse && userRole === "student") {
        try {
          // Wrapped inside an object payload wrapper to fulfill backend validation constraints
          await enrollmentService.enrollCourse({ courseId: pendingCourse });
          localStorage.removeItem("pendingEnrollment");
          
          // Securely redirect directly to acquired courses pipeline
          navigate("/student/my-courses");
          return;
        } catch (enrollErr) {
          // Log parsing error warnings but safely bypass to proceed with dashboard migration
          console.warn("Auto enrollment failed in background task safely:", enrollErr);
        }
      }

      // Role-based redirection fallback structure execution layer
      if (userRole === "admin") {
        navigate("/admin/dashboard");
      } else if (userRole === "instructor") {
        navigate("/instructor/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    } catch (err) {
      console.error("Login execution error payload:", err);

      setError(
        err.response?.data?.message ||
          "Invalid email or password credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-6 col-lg-4">
              <div className="card shadow-sm border-0 p-4">
                
                {/* Header */}
                <div className="text-center mb-4">
                  <i className="bi bi-lock-fill text-primary fs-1"></i>
                  <h3 className="fw-bold mt-2">Login</h3>
                  <p className="text-muted small">
                    Enter your credentials to access the LMS portal registry.
                  </p>
                </div>

                {/* Error message */}
                {error && (
                  <div className="alert alert-danger small p-2" role="alert">
                    {error}
                  </div>
                )}

                {/* Login form */}
                <form onSubmit={handleSubmit}>
                  
                  {/* Email field */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-semibold">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* Password field */}
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label fw-semibold">
                      Password
                    </label>

                    <div className="position-relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control pe-5"
                        id="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />

                      {/* Toggle password visibility */}
                      <i
                        className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                        onClick={() => !loading && setShowPassword(!showPassword)}
                        style={{
                          position: "absolute",
                          right: "15px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          cursor: loading ? "not-allowed" : "pointer",
                          color: "#6c757d",
                          zIndex: 5,
                        }}
                      ></i>
                    </div>
                  </div>

                  {/* Remember + Forgot */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                        disabled={loading}
                      />
                      <label className="form-check-label small" htmlFor="rememberMe">
                        Remember me
                      </label>
                    </div>

                    <Link
                      to="/forgot-password"
                      className="small text-primary text-decoration-none"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  {/* Submit button */}
                  <button 
                    type="submit" 
                    className="btn btn-primary w-100 fw-semibold d-flex align-items-center justify-content-center" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Authenticating...
                      </>
                    ) : "Login"}
                  </button>
                </form>

                {/* Register link */}
                <div className="text-center mt-3">
                  <span className="small text-muted">Don’t have an account?</span>
                  <Link
                    to="/register"
                    className="small fw-bold text-success text-decoration-none ms-1"
                  >
                    Register here
                  </Link>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Login;