const Lesson = require('../models/Lesson');
const { sendSuccess, sendError } = require('../utils/responseHandler');

/**
 * @desc    Create a new lesson
 * @route   POST /lessons
 * @access  Private (Instructor/Admin)
 */
const createLesson = async (req, res, next) => {
  try {
    const { courseId, title, content, videoUrl } = req.body;

    let finalVideoUrl = videoUrl || '';

    // If file is uploaded, override video URL with uploaded file path
    if (req.file) {
      finalVideoUrl = `/uploads/lessons/${req.file.filename}`;
    }

    const newLesson = new Lesson({
      course: courseId,
      title,
      content,
      videoUrl: finalVideoUrl,
    });

    await newLesson.save();

    return sendSuccess(res, 'Lesson created successfully', newLesson, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update lesson
 * @route   PUT /lessons/:id
 * @access  Private (Instructor/Admin)
 */
const updateLesson = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, content, videoUrl } = req.body;

    let lesson = await Lesson.findById(id);

    if (!lesson) {
      return sendError(res, 'Lesson not found', 404);
    }

    lesson.title = title || lesson.title;
    lesson.content = content || lesson.content;

    if (req.file) {
      lesson.videoUrl = `/uploads/lessons/${req.file.filename}`;
    } else if (videoUrl !== undefined) {
      lesson.videoUrl = videoUrl;
    }

    await lesson.save();

    return sendSuccess(res, 'Lesson updated successfully', lesson);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get lessons by course
 * @route   GET /courses/:courseId/lessons
 * @access  Public/Private
 */
const getLessonsByCourse = async (req, res, next) => {
  try {
    const lessons = await Lesson.find({ course: req.params.courseId });

    return sendSuccess(res, 'Lessons retrieved successfully', lessons);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete lesson
 * @route   DELETE /lessons/:id
 * @access  Private (Instructor/Admin)
 */
const deleteLesson = async (req, res, next) => {
  try {
    const { id } = req.params;

    const lesson = await Lesson.findByIdAndDelete(id);

    if (!lesson) {
      return sendError(res, 'Lesson not found', 404);
    }

    return sendSuccess(res, 'Lesson deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLessonsByCourse,
  createLesson,
  updateLesson,
  deleteLesson,
};