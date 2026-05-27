import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import DashboardLayout from '../../layouts/DashboardLayout';
import LessonUploadForm from '../../components/courses/LessonUploadForm';
import Loader from '../../components/common/Loader';
import courseService from '../../services/courseService';
import lessonService from '../../services/lessonService';

export const UploadLessons = () => {
  // =========================
  // STATE MANAGEMENT
  // =========================
  const [courses, setCourses] = useState([]);
  const [allLessons, setAllLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Lesson edit state
  const [selectedLessonForEdit, setSelectedLessonForEdit] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editVideoUrl, setEditVideoUrl] = useState('');
  const [editVideoFile, setEditVideoFile] = useState(null);
  const [uploadType, setUploadType] = useState('link');

  // Video preview modal state
  const [previewVideoUrl, setPreviewVideoUrl] = useState(null);
  const [previewVideoType, setPreviewVideoType] = useState(null);

  // =========================
  // FETCH COURSES + LESSONS
  // =========================
  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const fetchedCourses = await courseService.getInstructorCourses();

      // Normalize API response
      const actualCourses = fetchedCourses?.data || fetchedCourses || [];
      setCourses(actualCourses);

      // Fetch lessons for each course
      if (actualCourses.length > 0) {
        let tempLessons = [];

        for (let course of actualCourses) {
          const lessonsData = await lessonService.getLessonsByCourse(course._id);

          if (Array.isArray(lessonsData)) {
            const enrichedLessons = lessonsData.map((lesson) => ({
              ...lesson,
              courseTitle: course.title
            }));

            tempLessons = [...tempLessons, ...enrichedLessons];
          }
        }

        setAllLessons(tempLessons);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to download curriculum metadata.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // =========================
  // CREATE LESSON HANDLER
  // =========================
  const handleLessonCreated = async (lessonData) => {
    setSubmitting(true);

    try {
      await lessonService.createLesson(lessonData);
      await fetchAllData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to sync creation stream.');
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // OPEN EDIT MODAL
  // =========================
  const handleEditClick = (lesson) => {
    setSelectedLessonForEdit(lesson);

    setEditTitle(lesson.title);
    setEditContent(lesson.content);

    // Detect upload type (file vs link)
    if (
      lesson.videoUrl &&
      (lesson.videoUrl.startsWith('/uploads/') || lesson.videoUrl.startsWith('uploads/'))
    ) {
      setUploadType('file');
      setEditVideoUrl('');
    } else {
      setUploadType('link');
      setEditVideoUrl(lesson.videoUrl || '');
    }

    setEditVideoFile(null);
  };

  // =========================
  // UPDATE LESSON HANDLER
  // =========================
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    if (!selectedLessonForEdit) return;

    setSubmitting(true);

    try {
      const updatedPayload = {
        title: editTitle,
        content: editContent,
        videoUrl: uploadType === 'link' ? editVideoUrl : '',
        videoFile: uploadType === 'file' ? editVideoFile : null
      };

      await lessonService.updateLesson(selectedLessonForEdit._id, updatedPayload);

      setSelectedLessonForEdit(null);
      await fetchAllData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update lesson module.');
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // VIDEO TYPE DETECTION
  // =========================
  const detectVideoType = (url) => {
    if (!url) return 'invalid';

    // Local MP4 uploads
    if (url.includes('/uploads/') || url.endsWith('.mp4')) return 'mp4';

    // YouTube links
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';

    // Block invalid internal routes
    if (
      url.includes('/courses/') ||
      url.includes(process.env.REACT_APP_FRONTEND_URL) ||
      url.includes('/dashboard')
    ) {
      return 'invalid';
    }

    return 'invalid';
  };

  // =========================
  // CONVERT VIDEO URL
  // =========================
  const getVideoSrc = (url) => {
    if (!url) return '';

    // External URLs
    if (url.startsWith('http://') || url.startsWith('https://')) return url;

    // Backend hosted files
    const backendBaseUrl = process.env.REACT_APP_API_URL;

    if (url.startsWith('/')) return `${backendBaseUrl}${url}`;

    return `${backendBaseUrl}/${url}`;
  };

  // =========================
  // PLAY VIDEO HANDLER
  // =========================
  const handlePlayVideo = (videoUrl) => {
    const type = detectVideoType(videoUrl);

    if (type === 'invalid') {
      alert('Invalid video URL');
      return;
    }

    let finalUrl = videoUrl;

    // Convert YouTube URLs to embed format
    if (type === 'youtube') {
      if (videoUrl.includes('youtu.be/')) {
        const id = videoUrl.split('youtu.be/')[1];
        finalUrl = `https://www.youtube.com/embed/${id}`;
      }

      if (videoUrl.includes('watch?v=')) {
        const id = videoUrl.split('watch?v=')[1].split('&')[0];
        finalUrl = `https://www.youtube.com/embed/${id}`;
      }
    } else {
      finalUrl = getVideoSrc(videoUrl);
    }

    setPreviewVideoType(type);
    setPreviewVideoUrl(finalUrl);
  };

  return (
    <DashboardLayout>

      {/* Page Header */}
      <div className="mb-4">
        <h2 className="fw-bold text-dark">Lecture Publishing Base</h2>
        <p className="text-muted small">
          Link external media assets or manage server-side video streams.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <Loader message="Querying publishing portals..." />
      ) : (
        <div className="row">

          {/* LEFT: Upload Form */}
          <div className="col-lg-5 mb-4">
            <LessonUploadForm
              courses={courses}
              onLessonCreated={handleLessonCreated}
              submitting={submitting}
            />
          </div>

          {/* RIGHT: Lessons List */}
          <div className="col-lg-7">
            <div className="card shadow-sm border-0 p-4 bg-white">

              <h5 className="fw-bold text-dark mb-3">
                <i className="bi bi-collection-play-fill text-primary me-2"></i>
                Your Published Lectures ({allLessons.length})
              </h5>

              {allLessons.length === 0 ? (
                <p className="text-muted small my-3">
                  No lectures published yet.
                </p>
              ) : (
                <div style={{ maxHeight: '550px', overflowY: 'auto' }}>

                  {/* Group lessons by course */}
                  {Object.entries(
                    allLessons.reduce((acc, lesson) => {
                      const cat = lesson.courseTitle || 'Uncategorized';
                      if (!acc[cat]) acc[cat] = [];
                      acc[cat].push(lesson);
                      return acc;
                    }, {})
                  ).map(([category, lessons], idx) => (
                    <div key={idx} className="mb-3 border rounded bg-white overflow-hidden">

                      {/* Category Header */}
                      <button
                        type="button"
                        className="btn w-100 text-start d-flex justify-content-between align-items-center p-3 fw-bold border-0"
                        data-bs-toggle="collapse"
                        data-bs-target={`#cat-${idx}`}
                        style={{ background: '#f8f9fa' }}
                      >
                        <span className="text-truncate pe-2">{category}</span>
                        <i className="bi bi-chevron-down flex-shrink-0"></i>
                      </button>

                      {/* Responsive Table Wrapper - Protects horizontal space inside accordion collapse */}
                      <div id={`cat-${idx}`} className="collapse">
                        <div className="table-responsive w-100" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                          <table className="table table-hover align-middle mb-0">
                            <tbody>
                              {lessons.map((lesson) => (
                                <tr key={lesson._id}>

                                  {/* Title & Metadata Column */}
                                  <td style={{ minWidth: '220px' }}>
                                    <div className="fw-bold text-dark text-wrap">{lesson.title}</div>
                                    <div className="text-muted small text-truncate" style={{ maxWidth: '200px' }} title={lesson.content}>
                                      {lesson.content}
                                    </div>
                                  </td>

                                  {/* Course Title Badge Column */}
                                  <td className="text-nowrap" style={{ minWidth: '140px' }}>
                                    <span className="badge bg-secondary-subtle text-secondary text-wrap d-inline-block" style={{ fontSize: '0.75rem', maxWidth: '130px' }}>
                                      {lesson.courseTitle}
                                    </span>
                                  </td>

                                  {/* Responsive Action Buttons Column */}
                                  <td className="text-end text-nowrap" style={{ minWidth: '130px' }}>
                                    <div className="d-inline-flex gap-2 justify-content-end text-nowrap">
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-outline-primary d-inline-flex align-items-center text-nowrap"
                                        onClick={() => handlePlayVideo(lesson.videoUrl)}
                                      >
                                        <i className="bi bi-play-fill me-1"></i> Play
                                      </button>

                                      <button
                                        type="button"
                                        className="btn btn-sm btn-outline-warning d-inline-flex align-items-center text-nowrap"
                                        onClick={() => handleEditClick(lesson)}
                                      >
                                        <i className="bi bi-pencil-fill me-1"></i> Edit
                                      </button>
                                    </div>
                                  </td>

                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================
          VIDEO PREVIEW MODAL
      ========================= */}
      {previewVideoUrl && (
        <div className="modal d-block show" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content border-0 shadow overflow-hidden">

              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-play-circle-fill me-2"></i>
                  Lecture Preview
                </h5>

                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setPreviewVideoUrl(null)}
                />
              </div>

              <div className="modal-body bg-black p-0">

                {/* YouTube Video */}
                {previewVideoUrl.includes('youtube.com') || previewVideoUrl.includes('youtu.be') ? (
                  <div className="ratio ratio-16x9">
                    <iframe
                      src={
                        previewVideoUrl.includes('embed')
                          ? previewVideoUrl
                          : previewVideoUrl.replace('watch?v=', 'embed/')
                      }
                      title="YouTube video"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="ratio ratio-16x9 bg-black">
                    <video controls autoPlay className="w-100 h-100" style={{ objectFit: 'contain' }}>
                      <source src={previewVideoUrl} type="video/mp4" />
                    </video>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================
          EDIT MODAL
      ========================= */}
      {selectedLessonForEdit && (
        <div className="modal d-block show" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>

          <div className="modal-dialog modal-dialog-centered">

            <div className="modal-content border-0 shadow">

              <div className="modal-header bg-warning text-dark">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-pencil-square me-2"></i>
                  Edit Lecture Module
                </h5>

                <button type="button" className="btn-close" onClick={() => setSelectedLessonForEdit(null)} />
              </div>

              <form onSubmit={handleUpdateSubmit}>
                <div className="modal-body">

                  <div className="mb-3">
                    <label className="form-label small fw-bold">Lecture Title</label>
                    <input className="form-control" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} required />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold">Video Type</label>

                    <div className="btn-group w-100">
                      <input type="radio" id="edit-link" className="btn-check" checked={uploadType === 'link'} onChange={() => setUploadType('link')} />
                      <label htmlFor="edit-link" className="btn btn-outline-secondary btn-sm">Link</label>

                      <input type="radio" id="edit-file" className="btn-check" checked={uploadType === 'file'} onChange={() => setUploadType('file')} />
                      <label htmlFor="edit-file" className="btn btn-outline-secondary btn-sm">File</label>
                    </div>
                  </div>

                  {uploadType === 'link' ? (
                    <input className="form-control mb-3" value={editVideoUrl} onChange={(e) => setEditVideoUrl(e.target.value)} />
                  ) : (
                    <input type="file" className="form-control mb-3" onChange={(e) => setEditVideoFile(e.target.files[0])} />
                  )}

                  <label className="form-label small fw-bold">Lecture Content</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    required
                  />

                </div>

                <div className="modal-footer bg-light">
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setSelectedLessonForEdit(null)}>
                    Cancel
                  </button>

                  <button type="submit" className="btn btn-warning btn-sm fw-bold" disabled={submitting}>
                    {submitting ? 'Processing...' : 'Save Changes'}
                  </button>
                </div>

              </form>

            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
};

export default UploadLessons;