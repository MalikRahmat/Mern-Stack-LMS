import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import Loader from '../../components/common/Loader';
import CourseDetails from '../../components/courses/CourseDetails';
import courseService from '../../services/courseService';
import enrollmentService from '../../services/enrollmentService';
import { useAuth } from '../../hooks/useAuth';

export const CourseDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [enrollment, setEnrollment] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if the current user is evaluating/auditing the course from admin panels
  const isAuditMode = searchParams.get('mode') === 'audit' && (user?.role === 'admin' || user?.role === 'instructor');

  // Determines whether user is accessing learning mode route
  const isLearningRoute = location.pathname.startsWith('/courses/');

  // Enrollment state flags
  const isApproved = enrollment?.status === 'approved';
  const isPending = enrollment?.status === 'pending';
  const isRejected = enrollment?.status === 'rejected';

  // Fetch course details, lessons, and enrollment data
  const fetchCourseData = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await courseService.getCourseById(id);
      setCourse(data.course);

      // Access control for learning route
      if (isLearningRoute) {
        if (!user) {
          navigate('/login');
          return;
        }

        // Admin and Instructor bypass enrollment restrictions
        if (user.role === 'admin' || user.role === 'instructor') {
          setLessons(data.lessons || []);
        } 
        // Student access requires approved enrollment
        else if (user.role === 'student') {
          const enrolls = await enrollmentService.getMyCourses();

          const matchedEnrollment = enrolls.find(
            (e) => e.course?._id === id && e.status === 'approved'
          );

          if (!matchedEnrollment) {
            navigate('/course-overview/' + id);
            return;
          }

          setEnrollment(matchedEnrollment);
          setLessons(data.lessons || []);
        } 
        // Unauthorized roles redirected
        else {
          navigate('/login');
          return;
        }
      } else {
        // Safe Fallback: Populating lessons array during public views to fix zero-count indicators
        setLessons(data.lessons || []);

        // Load enrollment info if student is logged in
        if (user && user.role === 'student') {
          const enrolls = await enrollmentService.getMyCourses();

          const matchedEnrollment = enrolls.find(
            (e) => e.course?._id === id
          );

          if (matchedEnrollment) {
            setEnrollment(matchedEnrollment);
          }
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Course not found.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [id, user]);

  // Handles course enrollment request
  const handleEnroll = async () => {
    try {
      if (!user) {
        localStorage.setItem('pendingEnrollment', id);
        navigate('/login');
        return;
      }

      if (user.role !== 'student') {
        alert('Only students can enroll in courses.');
        return;
      }

      if (isApproved) {
        alert('You are already enrolled in this course.');
        return;
      }

      if (isPending) {
        alert('Your enrollment request is pending approval.');
        return;
      }

      await enrollmentService.enrollCourse(id);
      await fetchCourseData();
      alert('Enrollment request submitted successfully.');
    } catch (error) {
      alert(error.response?.data?.message || 'Enrollment failed.');
    }
  };

  // Bypasses public headers/footers if the admin is executing an internal curriculum audit
  const StructuralLayout = isAuditMode ? React.Fragment : MainLayout;

  return (
    <StructuralLayout>
      {/* Dynamic Quality Assurance Warning Banner for Administrators */}
      {isAuditMode && (
        <div 
          className="w-100 py-3 px-4 text-dark border-bottom d-flex flex-wrap justify-content-between align-items-center shadow-sm"
          style={{ backgroundColor: '#fef08a', borderColor: '#fef08a' }}
        >
          <div className="d-flex align-items-center gap-2 mb-2 mb-md-0">
            <span className="spinner-grow spinner-grow-sm text-warning" role="status"></span>
            <i className="bi bi-shield-fill-check text-dark fs-5"></i>
            <div>
              <strong className="d-block text-uppercase tracking-wider small">Administrative Review Mode</strong>
              <span className="text-muted small">Auditing curriculum assets, meta-structure, and syllabus validation.</span>
            </div>
          </div>
          <button 
            onClick={() => navigate(-1)} 
            className="btn btn-sm btn-dark d-flex align-items-center gap-2 shadow-sm fw-semibold"
          >
            <i className="bi bi-arrow-left-short fs-5"></i>
            Exit Audit Session
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <Loader message="Loading curriculum timeline..." />
      ) : error ? (
        // Error State
        <div className="container py-5 text-center">
          <div className="alert alert-danger" role="alert">
            <i className="bi bi-file-earmark-lock2-fill me-2 fs-3"></i>
            <h4 className="fw-bold mt-2">Curriculum Resource Offline</h4>
            <p className="small mb-0">{error}</p>
          </div>
          <Link to="/courses" className="btn btn-primary mt-3">
            Return to Catalog
          </Link>
        </div>
      ) : !course ? (
        // Not Found State
        <div className="container py-5 text-center">
          <h4 className="fw-bold text-dark">Course not found</h4>
          <Link to="/courses" className="btn btn-primary mt-2">
            Return to Catalog
          </Link>
        </div>
      ) : (
        <div>

          {/* Course Header Section */}
          <section
            className="bg-dark text-white py-5 mb-4"
            style={{
              background: 'linear-gradient(to right, #0f172a, #1e293b)'
            }}
          >
            <div className="container">

              {/* Breadcrumb Navigation */}
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-3">
                  <li className="breadcrumb-item">
                    <Link
                      to="/courses"
                      className="text-decoration-none text-white-50"
                    >
                      Catalog
                    </Link>
                  </li>
                  <li
                    className="breadcrumb-item active text-white"
                    aria-current="page"
                  >
                    {course.category}
                  </li>
                </ol>
              </nav>

              {/* Course Title */}
              <h1 className="display-5 fw-extrabold mb-2">
                {course.title}
              </h1>

              {/* Instructor Info */}
              <p className="lead text-white-50 mb-3">
                Instructed by {course.instructor?.name || 'Academic Faculty'}
              </p>

              {/* Enrollment / Access Controls */}
              {!location.pathname.startsWith('/courses/') && (
                <>
                  {user && (user.role === 'admin' || user.role === 'instructor') ? (
                    <Link
                      to={`/courses/${course._id}`}
                      className="btn btn-success btn-lg"
                    >
                      <i className="bi bi-eye-fill me-2"></i>
                      View Course Content (Staff Access)
                    </Link>
                  ) : isApproved ? (
                    <Link
                      to={`/courses/${course._id}`}
                      className="btn btn-success btn-lg"
                    >
                      <i className="bi bi-play-circle me-2"></i>
                      Resume Learning
                    </Link>
                  ) : isPending ? (
                    <button
                      className="btn btn-warning btn-lg text-dark"
                      disabled
                    >
                      <i className="bi bi-hourglass-split me-2"></i>
                      Pending Approval
                    </button>
                  ) : isRejected ? (
                    <button
                      onClick={handleEnroll}
                      className="btn btn-danger btn-lg"
                    >
                      <i className="bi bi-arrow-repeat me-2"></i>
                      Enroll Again
                    </button>
                  ) : (
                    <button
                      onClick={handleEnroll}
                      className="btn btn-primary btn-lg"
                    >
                      <i className="bi bi-mortarboard-fill me-2"></i>
                      Enroll Now
                    </button>
                  )}
                </>
              )}
            </div>
          </section>

          {/* Course Details Section */}
          <div className="container pb-5">
            <CourseDetails
              course={course}
              lessons={lessons}
              enrollment={enrollment}
              onEnrollSuccess={fetchCourseData}
              onProgressUpdated={fetchCourseData}
              onEnrollClick={handleEnroll}
            />
          </div>

        </div>
      )}
    </StructuralLayout>
  );
};

export default CourseDetailsPage;