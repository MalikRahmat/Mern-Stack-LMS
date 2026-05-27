import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "../../api/axios";
import MainLayout from "../../layouts/MainLayout";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `/auth/reset-password/${token}`,
        {
          password: formData.password
        }
      );

      if (response.data.success) {
        setSuccess("Password has been reset successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Link might be expired."
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

                <div className="text-center mb-4">
                  <i className="bi bi-key-fill text-danger fs-1"></i>
                  <h3 className="fw-bold mt-2">New Password</h3>
                  <p className="text-muted small">
                    Enter your new secure account password.
                  </p>
                </div>

                {error && (
                  <div className="alert alert-danger small p-2">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="alert alert-success small p-2">
                    {success}
                  </div>
                )}

                <form onSubmit={handleSubmit} autoComplete="off">

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      New Password
                    </label>
                    <div className="position-relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control pe-5"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
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
                          cursor: "pointer"
                        }}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Confirm Password
                    </label>
                    <div className="position-relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className="form-control pe-5"
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                      <i
                        className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"}`}
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        style={{
                          position: "absolute",
                          right: "15px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          cursor: "pointer"
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-danger w-100 fw-semibold"
                    disabled={loading}
                  >
                    {loading ? "Updating Password..." : "Reset Password"}
                  </button>
                </form>

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

export default ResetPassword;