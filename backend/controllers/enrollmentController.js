const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const { sendSuccess, sendError } = require('../utils/responseHandler');

/**
 * @desc    Enroll in a course
 * @route   POST /enrollments
 * @access  Private (Student)
 */
const enrollInCourse = async (req, res, next) => {
  try {
    const { courseId } = req.body;

    if (!courseId) {
      return sendError(res, 'Course ID is required', 400);
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return sendError(res, 'Course not found', 404);
    }

    const existing = await Enrollment.findOne({
      student: req.user._id,
      course: courseId,
    });

    if (existing) {
      if (existing.status === 'pending') {
        return sendError(
          res,
          'Your enrollment request is already pending approval.',
          400
        );
      }

      if (existing.status === 'approved') {
        return sendError(
          res,
          'You are already enrolled in this course.',
          400
        );
      }

      if (existing.status === 'rejected') {
        existing.status = 'pending';
        existing.progress = 0;
        existing.completedLessons = [];

        await existing.save();

        return sendSuccess(
          res,
          'Enrollment request submitted again successfully.',
          existing,
          200
        );
      }
    }

    const enrollment = await Enrollment.create({
      student: req.user._id,
      course: courseId,
      progress: 0,
      completedLessons: [],
      status: 'pending',
    });

    return sendSuccess(
      res,
      'Enrollment request submitted successfully.',
      enrollment,
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update enrollment status
 * @route   PATCH /enrollments/:id/status
 * @access  Private (Instructor/Admin)
 */
const updateEnrollmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const enrollment = await Enrollment.findById(req.params.id)
      .populate('student', 'name email')
      .populate('course', 'title');

    if (!enrollment) {
      return sendError(res, 'Enrollment request not found', 404);
    }

    if (!status || !['approved', 'rejected'].includes(status)) {
      return sendError(res, 'Valid status is required', 400);
    }

    enrollment.status = status;

    // Reset progress if enrollment is rejected
    if (status === 'rejected') {
      enrollment.progress = 0;
      enrollment.completedLessons = [];
    }

    await enrollment.save();

    return sendSuccess(
      res,
      `Enrollment ${status} successfully.`,
      enrollment
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get logged-in student courses
 * @route   GET /enrollments/my-courses
 * @access  Private (Student)
 */
const getMyCourses = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({
      student: req.user._id,
    })
      .populate({
        path: 'course',
        populate: {
          path: 'instructor',
          select: 'name email',
        },
      })
      .sort({ createdAt: -1 });

    return sendSuccess(
      res,
      'Student enrollments fetched successfully.',
      enrollments
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update enrollment progress
 * @route   PATCH /enrollments/:id/progress
 * @access  Private (Student)
 */
const updateEnrollmentProgress = async (req, res, next) => {
  try {
    const { progress, completedLessons } = req.body;

    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return sendError(res, 'Enrollment not found', 404);
    }

    if (enrollment.student.toString() !== req.user._id.toString()) {
      return sendError(res, 'Unauthorized access', 403);
    }

    if (enrollment.status !== 'approved') {
      return sendError(
        res,
        'Only approved enrollments can access lessons and update progress.',
        403
      );
    }

    enrollment.progress = progress ?? enrollment.progress;
    enrollment.completedLessons =
      completedLessons ?? enrollment.completedLessons;

    await enrollment.save();

    return sendSuccess(res, 'Progress updated successfully.', enrollment);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all enrollments (Admin)
 * @route   GET /enrollments
 * @access  Private (Admin)
 */
const getAllEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('student', 'name email role')
      .populate('course', 'title category price')
      .sort({ createdAt: -1 });

    return sendSuccess(
      res,
      'All enrollments fetched successfully.',
      enrollments
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete enrollment
 * @route   DELETE /enrollments/:id
 * @access  Private (Admin/Instructor)
 */
const deleteEnrollment = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return sendError(res, 'Enrollment not found', 404);
    }

    await enrollment.deleteOne();

    return sendSuccess(res, 'Enrollment deleted successfully.');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  enrollInCourse,
  updateEnrollmentStatus,
  getMyCourses,
  updateEnrollmentProgress,
  getAllEnrollments,
  deleteEnrollment,
};