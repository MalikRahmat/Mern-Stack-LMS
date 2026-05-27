import React, { useEffect, useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import CourseList from '../../components/courses/CourseList';
import Loader from '../../components/common/Loader';
import courseService from '../../services/courseService';
import enrollmentService from '../../services/enrollmentService';
import categoryService from '../../services/categoryService'; // Ingesting dynamic records pipeline
import { useAuth } from '../../hooks/useAuth';

/**
 * @component Courses
 * @description Centralized controller view pulling administrative courses and live classifications parameters.
 */
export const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [dbCategories, setDbCategories] = useState([]); // Dynamic listing bridge state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Load all available courses
        const coursesData = await courseService.getAllCourses();
        setCourses(coursesData || []);

        // Load enrollments only for student users
        if (user && user.role === 'student') {
          const enrollments = await enrollmentService.getMyCourses();
          setEnrolledCourses(enrollments || []);
        } else {
          setEnrolledCourses([]);
        }

        // Pull dynamic backend classification rows synchronously
        if (categoryService && typeof categoryService.getCategories === 'function') {
          const categoryRecords = await categoryService.getCategories();
          setDbCategories(categoryRecords || []);
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            'Failed to load courses.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return (
    <MainLayout>
      {/* Page Section Wrapper */}
      <section className="bg-light py-5">
        <div className="container">

          {/* Page Header */}
          <div className="text-center mb-5">
            <h1 className="fw-extrabold text-dark mb-2">
              Explore Modern Curriculums
            </h1>
            <p className="text-muted lead">
              Browse available courses, enroll in classrooms, and continue your learning journey.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-danger" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </div>
          )}

          {/* Loading State Check */}
          {loading ? (
            <Loader message="Loading available courses..." />
          ) : (
            // Passing the fresh database matrix directly through structural state tags
            <CourseList
              courses={courses}
              enrolledCourses={enrolledCourses}
              dbCategories={dbCategories}
            />
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default Courses;