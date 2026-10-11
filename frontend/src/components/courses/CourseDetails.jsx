import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { formatPrice } from '../../utils/helpers';
import enrollmentService from '../../services/enrollmentService';

/**
 * @component CourseDetails
 * @description Displays full course details, lessons, enrollment actions, and progress tracking UI with persistent active lesson state mapping.
 */
export const CourseDetails = ({
  course,
  lessons = [],
  enrollment,
  onEnrollSuccess,
  onProgressUpdated,
  onEnrollClick,
}) => {
  const { user } = useAuth();

  const [enrolling, setEnrolling] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [activeLesson, setActiveLesson] = useState(null);

  const isApproved = enrollment?.status === 'approved';
  const isPending = enrollment?.status === 'pending';
  const isRejected = enrollment?.status === 'rejected';

  /**
   * Determine whether user has access to course lessons
   */
  const canAccessLessons =
    isApproved ||
    user?.role === 'admin' ||
    user?.role === 'instructor';

  //  STORAGE LOCK: Unique lookup key scoped directly per course scope layout identity
  const STORAGE_KEY = course?._id ? `active_lesson_course_${course._id}` : null;

  /**
   * FEATURE RETENTION: Automatically restores historical active lessons or defaults to the first lesson index.
   * Runs sequentially whenever the component handles visibility pipelines or handles parent dynamic modifications.
   */
  useEffect(() => {
    if (canAccessLessons && lessons.length > 0 && !activeLesson) {
      let lessonToInitialize = lessons[0]; // Standard baseline setup anchor

      if (STORAGE_KEY) {
        // Look up unique storage allocations to recover client location checkpoints
        const savedLessonId = localStorage.getItem(STORAGE_KEY);
        const bookedLessonNode = lessons.find((l) => l._id === savedLessonId);

        if (bookedLessonNode) {
          lessonToInitialize = bookedLessonNode; // Restore historical bookmark match
        }
      }

      setActiveLesson(lessonToInitialize);
    }
  }, [canAccessLessons, lessons, activeLesson, STORAGE_KEY]);

  /**
   * Handle course enrollment request
   */
  const handleEnroll = async () => {
    setMsg({ type: '', text: '' });

    if (isApproved) {
      setMsg({
        type: 'success',
        text: 'You are already enrolled in this course.',
      });
      return;
    }

    if (isPending) {
      setMsg({
        type: 'warning',
        text: 'Your enrollment request is pending approval.',
      });
      return;
    }

    setEnrolling(true);

    try {
      if (onEnrollClick) {
        await onEnrollClick();
      }

      if (onEnrollSuccess) {
        onEnrollSuccess();
      }
    } catch (err) {
      setMsg({
        type: 'danger',
        text: err.response?.data?.message || 'Enrollment failed.',
      });
    } finally {
      setEnrolling(false);
    }
  };

  /**
   * Toggle lesson completion status and update progress while safely maintaining playback continuity
   */
  const handleToggleComplete = async (lessonId) => {
    if (!isApproved) return;

    let completed = [...(enrollment.completedLessons || [])];

    if (completed.includes(lessonId)) {
      completed = completed.filter((id) => id !== lessonId);
    } else {
      completed.push(lessonId);
    }

    const progressPercent = Math.round(
      (completed.length / lessons.length) * 100
    );

    try {
      await enrollmentService.updateProgress(enrollment._id, {
        progress: progressPercent,
        completedLessons: completed,
      });

      /**
       * 🔥 STATE PRESERVATION INSIGHT:
       * Triggering onProgressUpdated() updates parent references, causing state mutations.
       * Since activeLesson remains locked via localStorage, the render scope reloads safely without skipping the viewport index.
       */
      if (onProgressUpdated) {
        onProgressUpdated();
      }
    } catch (err) {
      console.error('Failed to update progress', err);
    }
  };

  /**
   * Select a lesson for playback and record historical tracking anchors.
   */
  const selectLesson = (lesson) => {
    if (!canAccessLessons) {
      setMsg({
        type: 'warning',
        text: 'Only approved enrolled students can access lessons.',
      });
      return;
    }

    setMsg({ type: '', text: '' });
    setActiveLesson(lesson);

    // 💾 Persist selected active coordinate token indexes natively inside system cache
    if (STORAGE_KEY && lesson?._id) {
      localStorage.setItem(STORAGE_KEY, lesson._id);
    }
  };

  /**
   * Check if lesson is completed
   */
  const isLessonDone = (lessonId) => {
    return enrollment?.completedLessons?.includes(lessonId);
  };

  /**
   * Detect video type from URL
   */
  const getVideoType = (url) => {
    if (!url) return 'invalid';

    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return 'youtube';
    }

    if (url.includes('/uploads/lessons/') || url.endsWith('.mp4')) {
      return 'mp4';
    }

    return 'invalid';
  };

  /**
   * Convert YouTube URL into embeddable format
   */
  const getYoutubeEmbedUrl = (url) => {
    if (!url) return '';

    if (url.includes('/embed/')) {
      return url;
    }

    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    if (url.includes('watch?v=')) {
      const videoId = url.split('watch?v=')[1].split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    return url;
  };

  const currentVideoUrl = activeLesson?.videoUrl || '';
  const videoType = getVideoType(currentVideoUrl);

  // Safe counting variable for modules to prevent 0 on logouts
  const totalModulesCount = lessons && lessons.length ? lessons.length : (course?.lessons?.length || 0);

  return (
    <div>
      {msg.text && (
        <div className={`alert alert-${msg.type} alert-dismissible fade show`} role="alert">
          <i className="bi bi-info-circle-fill me-2"></i>
          {msg.text}
          <button
            type="button"
            className="btn-close"
            onClick={() => setMsg({ type: '', text: '' })}
          ></button>
        </div>
      )}

      <div className="row g-4">
        <div className="col-lg-8">
          {/* Active Video Player Screen */}
          {activeLesson && canAccessLessons && (
            <div className="card shadow-sm border-0 mb-4 bg-white p-3">
              <div className="ratio ratio-16x9 mb-3 bg-dark rounded overflow-hidden">
                {videoType === 'youtube' && (
                  <iframe
                    key={activeLesson._id} // Dynamic key forcing frame initialization natively when tokens shift
                    src={getYoutubeEmbedUrl(currentVideoUrl)}
                    title={activeLesson.title}
                    allowFullScreen
                    className="w-100 h-100 border-0"
                  ></iframe>
                )}

                {videoType === 'mp4' && (
                  <video key={activeLesson._id} controls controlsList="nodownload" className="w-100 h-100">
                    <source
                      src={
                        currentVideoUrl.startsWith('http')
                          ? currentVideoUrl
                          : `${process.env.REACT_APP_API_URL}${currentVideoUrl}`
                      }
                      type="video/mp4"
                    />
                  </video>
                )}

                {videoType === 'invalid' && (
                  <div className="d-flex flex-column align-items-center justify-content-center h-100 text-white p-4 text-center">
                    <i className="bi bi-exclamation-triangle-fill fs-1 mb-3"></i>
                    <h5>Invalid Video Source</h5>
                    <p className="small mb-0">This lesson contains an invalid video URL.</p>
                  </div>
                )}
              </div>

              <h4 className="fw-bold text-dark">{activeLesson.title}</h4>
              <p className="text-muted small">
                <i className="bi bi-camera-video me-2"></i>
                Virtual Media Lecture
              </p>

              <hr />

              <h6 className="fw-bold">Lesson Material & Notes</h6>
              <div className="bg-light p-3 rounded" style={{ whiteSpace: 'pre-wrap' }}>
                {activeLesson.content}
              </div>

              {isApproved && (
                <div className="form-check mt-3 bg-success-subtle p-3 rounded d-flex align-items-center">
                  <input
                    className="form-check-input ms-1 me-2 style-pointer"
                    type="checkbox"
                    id="chkComplete"
                    checked={!!isLessonDone(activeLesson._id)}
                    onChange={() => handleToggleComplete(activeLesson._id)}
                    style={{ transform: 'scale(1.2)' }}
                  />
                  <label className="form-check-label fw-bold text-success" htmlFor="chkComplete">
                    Mark Lesson as Completed
                  </label>
                </div>
              )}
            </div>
          )}

          {/* "About This Course" section */}
          <div className="card shadow-sm border-0 bg-white p-4">
            <h4 className="fw-bold mb-3">About This Course</h4>
            <p className="text-muted" style={{ fontSize: '1.05rem', lineHeight: '1.6' }}>
              {course.description}
            </p>

            <div className="row g-3 mt-3">
              <div className="col-6 col-md-3 text-center">
                <div className="p-3 bg-light rounded text-primary h-100 d-flex flex-column justify-content-between">
                  <div>
                    <i className="bi bi-tag-fill fs-3 d-block mb-1"></i>
                    <span className="small text-muted d-block mb-1">Category</span>
                  </div>
                  <strong className="text-dark small d-block lh-sm text-wrap px-1">{course.category}</strong>
                </div>
              </div>

              <div className="col-6 col-md-3 text-center">
                <div className="p-3 bg-light rounded text-success h-100 d-flex flex-column justify-content-between">
                  <div>
                    <i className="bi bi-currency-dollar fs-3 d-block mb-1"></i>
                    <span className="small text-muted d-block mb-1">Pricing</span>
                  </div>
                  <strong className="text-dark small d-block">{formatPrice(course.price)}</strong>
                </div>
              </div>

              <div className="col-6 col-md-3 text-center">
                <div className="p-3 bg-light rounded text-warning h-100 d-flex flex-column justify-content-between">
                  <div>
                    <i className="bi bi-clock-fill fs-3 d-block mb-1"></i>
                    <span className="small text-muted d-block mb-1">Access</span>
                  </div>
                  <strong className="text-dark small d-block">Lifetime</strong>
                </div>
              </div>

              <div className="col-6 col-md-3 text-center">
                <div className="p-3 bg-light rounded text-danger h-100 d-flex flex-column justify-content-between">
                  <div>
                    <i className="bi bi-play-circle-fill fs-3 d-block mb-1"></i>
                    <span className="small text-muted d-block mb-1">Lectures</span>
                  </div>
                  <strong className="text-dark small d-block">
                    {totalModulesCount} Modules
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          {/* Enroll card */}
          {(!user || user.role === 'student') && !isApproved && (
            <div className="card bg-primary text-white border-0 p-4 mb-4 text-center">
              <h4 className="fw-bold">Enroll in Class</h4>
              <p className="small text-white-50">
                Access assignments, lessons, progress tracking, and course resources.
              </p>

              <h2 className="fw-extrabold my-3">{formatPrice(course.price)}</h2>

              {isPending ? (
                <button className="btn btn-warning btn-lg w-100 fw-bold text-dark" disabled>
                  Pending Approval
                </button>
              ) : isRejected ? (
                <button
                  className="btn btn-danger btn-lg w-100 fw-bold"
                  onClick={handleEnroll}
                  disabled={enrolling}
                >
                  Enroll Again
                </button>
              ) : (
                <button
                  className="btn btn-light btn-lg w-100 fw-bold text-primary"
                  onClick={handleEnroll}
                  disabled={enrolling}
                >
                  {enrolling ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Enrolling...
                    </>
                  ) : (
                    'Enroll Now'
                  )}
                </button>
              )}
            </div>
          )}

          {/* Academic Faculty Card */}
          <div className="card border-0 shadow-sm bg-white p-3 mb-4">
            <h6 className="fw-bold border-bottom pb-2">Academic Faculty</h6>
            <div className="d-flex align-items-center mt-2">
              <div
                className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold me-3"
                style={{ width: '48px', height: '48px' }}
              >
                <i className="bi bi-person-fill fs-4"></i>
              </div>

              <div>
                <h6 className="fw-bold text-dark mb-0">
                  {course.instructor?.name || 'Academic Instructor'}
                </h6>
                <p className="text-muted small mb-0">
                  {course.instructor?.email || 'faculty@lms.com'}
                </p>
                <span
                  className="badge bg-secondary-subtle text-secondary text-uppercase"
                  style={{ fontSize: '0.6rem' }}
                >
                  Instructor
                </span>
              </div>
            </div>
          </div>

          {/* Syllabus/Modules Sidebar */}
          <div className="card border-0 shadow-sm bg-white p-3">
            <h6 className="fw-bold border-bottom pb-2">
              Syllabus ({totalModulesCount} Modules)
            </h6>

            {lessons.length === 0 ? (
              <p className="text-muted small py-2">Lessons are not available yet.</p>
            ) : (
              <div
                className="list-group list-group-flush mt-2 pe-1"
                style={{ maxHeight: '320px', overflowY: 'auto', overflowX: 'hidden' }}
              >
                {lessons.map((lesson, idx) => {
                  const isActive = activeLesson?._id === lesson._id;
                  const isDone = isLessonDone(lesson._id);

                  return (
                    <button
                      key={lesson._id}
                      className={`list-group-item list-group-item-action border-0 d-flex justify-content-between align-items-center p-3 rounded mb-2 ${
                        isActive ? 'bg-primary-subtle text-primary fw-bold' : 'bg-light'
                      }`}
                      onClick={() => selectLesson(lesson)}
                    >
                      <div className="d-flex align-items-center overflow-hidden">
                        <span className="badge bg-secondary me-2">{idx + 1}</span>
                        <span className="text-truncate text-start small">{lesson.title}</span>
                      </div>

                      {isDone && <i className="bi bi-check-circle-fill text-success fs-5"></i>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;