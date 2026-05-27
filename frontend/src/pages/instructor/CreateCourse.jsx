import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import CourseForm from '../../components/courses/CourseForm';
import courseService from '../../services/courseService';

export const CreateCourse = () => {
  // Local state for form submission and error handling
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();

  /**
   * Handles course creation request
   * Sends course data to backend and navigates on success
   */
  const handleCreateCourse = async (courseData) => {
    setSubmitting(true);
    setErrorMsg('');

    try {
      await courseService.createCourse(courseData);
      navigate('/instructor/dashboard');
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message ||
          err.message ||
          'Failed to establish syllabus template.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      {/* Page Header Section */}
      <div className="mb-4">
        <h2 className="fw-bold text-dark">Publish Educational Catalogs</h2>
        <p className="text-muted small">
          Construct curriculum tracks by populating basic details, pricing guides, and category identifiers.
        </p>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="alert alert-danger mb-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {errorMsg}
        </div>
      )}

      {/* Course Creation Form Container */}
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <CourseForm onSubmit={handleCreateCourse} submitting={submitting} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateCourse;