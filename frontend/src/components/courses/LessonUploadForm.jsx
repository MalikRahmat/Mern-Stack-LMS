import React, { useState } from 'react';

/**
 * LessonUploadForm Component
 * Provides a form for creating lessons with video upload or link options.
 * Handles validation, error display, and submission logic.
 */
const LessonUploadForm = ({ courses, onLessonCreated, submitting }) => {
  const [courseId, setCourseId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [uploadType, setUploadType] = useState('link'); // Options: 'link' or 'file'
  const [videoUrl, setVideoUrl] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [formError, setFormError] = useState('');

  /**
   * Handles form submission with validation.
   * Builds lesson data object and triggers onLessonCreated callback.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!courseId) {
      setFormError('Please select a course destination.');
      return;
    }

    try {
      const lessonData = {
        courseId,
        title,
        content,
        videoUrl: uploadType === 'link' ? videoUrl : '',
        videoFile: uploadType === 'file' ? videoFile : null,
      };

      if (uploadType === 'file' && !videoFile) {
        setFormError('Please select an MP4 video file to upload.');
        return;
      }

      await onLessonCreated(lessonData);

      // Reset form fields after successful submission
      setTitle('');
      setContent('');
      setVideoUrl('');
      setVideoFile(null);

      const fileInput = document.getElementById('mainVideoFileReset');
      if (fileInput) fileInput.value = '';
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to publish lesson.');
    }
  };

  return (
    <div className="card shadow-sm border-0 p-4 bg-white">
      {/* Form Header */}
      <h5 className="fw-bold text-dark mb-4">
        <i className="bi bi-cloud-arrow-up-fill text-primary me-2"></i>
        Create Lecture Node
      </h5>

      {/* Error Message */}
      {formError && (
        <div className="alert alert-danger small p-2" role="alert">
          <i className="bi bi-exclamation-circle-fill me-2"></i>
          {formError}
        </div>
      )}

      {/* Lesson Form */}
      <form onSubmit={handleSubmit}>
        {/* Course Selection */}
        <div className="mb-3">
          <label className="form-label small fw-bold text-secondary">Target Course Container</label>
          <select
            className="form-select form-select-sm"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
            required
          >
            <option value="">-- Choose active stream catalog --</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        {/* Lesson Title */}
        <div className="mb-3">
          <label className="form-label small fw-bold text-secondary">Lecture Title</label>
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="e.g. Introduction to Python"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Upload Type Selection */}
        <div className="mb-3">
          <label className="form-label small fw-bold text-secondary d-block">Video Delivery Stream</label>
          <div className="btn-group w-100" role="group">
            <input
              type="radio"
              className="btn-check"
              name="mainUploadType"
              id="mainTypeLink"
              checked={uploadType === 'link'}
              onChange={() => setUploadType('link')}
            />
            <label className="btn btn-sm btn-outline-primary check-white-text mx-2" htmlFor="mainTypeLink">
              <i className="bi bi-link-45deg me-1"></i> Web Link
            </label>

            <input
              type="radio"
              className="btn-check"
              name="mainUploadType"
              id="mainTypeFile"
              checked={uploadType === 'file'}
              onChange={() => setUploadType('file')}
            />
            <label className="btn btn-sm btn-outline-primary check-white-text mx-2" htmlFor="mainTypeFile">
              <i className="bi bi-cloud-upload me-1"></i> Upload MP4 File
            </label>
          </div>
        </div>

        {/* Video URL or File Upload */}
        {uploadType === 'link' ? (
          <div className="mb-3">
            <label className="form-label small fw-bold text-secondary">Streaming / Resource URL</label>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="https://youtube.com/..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
          </div>
        ) : (
          <div className="mb-3">
            <label className="form-label small fw-bold text-secondary">Select Video Package</label>
            <input
              id="mainVideoFileReset"
              type="file"
              className="form-control form-control-sm"
              accept="video/mp4"
              onChange={(e) => setVideoFile(e.target.files[0])}
            />
          </div>
        )}

        {/* Lesson Description */}
        <div className="mb-4">
          <label className="form-label small fw-bold text-secondary">Coursework Context & Descriptions</label>
          <textarea
            className="form-control form-control-sm"
            rows="5"
            placeholder="Document prerequisites, code repositories, or core concepts handled inside this lecture."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary btn-sm w-100 fw-bold shadow-sm"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Broadcasting Asset Packages...
            </>
          ) : (
            <>
              <i className="bi bi-rocket-takeoff-fill me-2"></i> Publish Core Lecture
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default LessonUploadForm;
