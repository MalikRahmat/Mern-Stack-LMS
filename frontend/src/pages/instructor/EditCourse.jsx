import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import CourseForm from '../../components/courses/CourseForm';
import Loader from '../../components/common/Loader';
import courseService from '../../services/courseService';

export const EditCourse = () => {
  // Route parameter for course ID
  const { id } = useParams();

  // Navigation hook for redirecting after update
  const navigate = useNavigate();

  // Local state for course data
  const [course, setCourse] = useState(null);

  // Loading state for initial fetch
  const [loading, setLoading] = useState(true);

  // Submission state for update request
  const [submitting, setSubmitting] = useState(false);

  // Error message state
  const [errorMsg, setErrorMsg] = useState('');

  /**
   * Fetch course details by ID on component mount
   */
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);

        const data = await courseService.getCourseById(id);
        setCourse(data?.course);
      } catch (err) {
        setErrorMsg(
          err.response?.data?.message ||
            err.message ||
            'Course syllabus details unavailable.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  /**
   * Handles course update submission
   */
  const handleUpdateCourse = async (courseData) => {
    setSubmitting(true);
    setErrorMsg('');

    try {
      await courseService.updateCourse(id, courseData);
      navigate('/instructor/dashboard');
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message ||
          err.message ||
          'Upgrading catalog configurations failed.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-4">
        <h2 className="fw-bold text-dark">Modify Course Overview</h2>
        <p className="text-muted small">
          Tweak academic descriptions, categories, and prices dynamically.
        </p>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="alert alert-danger mb-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {errorMsg}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <Loader message="Querying academic syllabus structures..." />
      ) : !course ? (
        <div className="alert alert-warning" role="alert">
          Syllabus catalog was not resolved in index files.
        </div>
      ) : (
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <CourseForm
              initialData={course}
              onSubmit={handleUpdateCourse}
              submitting={submitting}
            />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default EditCourse;