import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../api/axios"; // Standard axios instance
import MainLayout from "../../layouts/MainLayout";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [devUrl, setDevUrl] = useState(""); // Development reset link (for testing)

  // Handles forgot password form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setDevUrl("");
    setLoading(true);

    try {
      // Call backend forgot password API
      const response = await axios.post("/auth/forgot-password", { email });

      // Check API success response
      if (response.data.success) {
        setSuccess("Password reset process initiated successfully.");

        // Set development URL if provided by backend
        if (response.data.data && response.data.data.developmentUrl) {
          setDevUrl(response.data.data.developmentUrl);
        }

        // Clear input field after success
        setEmail("");
      }
    } catch (err) {
      console.error("Forgot Password Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to send reset instructions. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      {/* Page Wrapper */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-6 col-lg-4">

              {/* Card Container */}
              <div className="card shadow-sm border-0 p-4">

                {/* Header Section */}
                <div className="text-center mb-4">
                  <i className="bi bi-shield-lock-fill text-warning fs-1"></i>
                  <h3 className="fw-bold mt-2">Reset Password</h3>
                  <p className="text-muted small">
                    Enter your registered email address to receive reset instructions.
                  </p>
                </div>

                {/* Error Alert */}
                {error && (
                  <div className="alert alert-danger small p-2" role="alert">
                    {error}
                  </div>
                )}

                {/* Success Alert */}
                {success && (
                  <div className="alert alert-success small p-2" role="alert">
                    {success}
                  </div>
                )}

                {/* Forgot Password Form */}
                <form onSubmit={handleSubmit} autoComplete="off">

                  {/* Email Field */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-semibold">
                      Email Address
                    </label>

                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-warning text-dark w-100 fw-semibold"
                    disabled={loading}
                  >
                    {loading ? "Processing Request..." : "Send Reset Link"}
                  </button>
                </form>

                {/* Development Testing Link */}
                {devUrl && (
                  <div className="mt-3 p-3 bg-dark text-success rounded border small text-break">

                    <strong className="text-white">
                      <i className="bi bi-bug-fill me-1"></i> Local Dev Link (Testing Only):
                    </strong>

                    <br />

                    <span className="text-muted small d-block my-1">
                      Backend development environment reset URL:
                    </span>

                    <a
                      href={devUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-success fw-bold text-decoration-underline"
                    >
                      {devUrl}
                    </a>
                  </div>
                )}

                {/* Footer Navigation */}
                <div className="text-center mt-3">
                  <Link
                    to="/login"
                    className="small text-primary text-decoration-none"
                  >
                    Back to Login
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

export default ForgotPassword;