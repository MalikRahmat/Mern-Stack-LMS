const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const Enrollment = require('../models/Enrollment');
const { sendSuccess, sendError } = require('../utils/responseHandler');

/**
 * @desc    Retrieve all courses
 * @route   GET /courses
 * @access  Public
 */
const getAllCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({}).populate('instructor');

    return sendSuccess(res, 'Courses retrieved successfully', courses);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Retrieve single course with its lessons
 * @route   GET /courses/:id
 * @access  Public
 */
const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor');

    if (!course) {
      return sendError(res, 'Course not found', 404);
    }

    const lessons = await Lesson.find({ course: course._id });

    return sendSuccess(res, 'Course details retrieved successfully', {
      course,
      lessons,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get logged-in instructor courses
 * @route   GET /courses/instructor/me
 * @access  Private (Instructor)
 */
const getInstructorCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ instructor: req.user._id }).populate('instructor');

    return sendSuccess(res, 'Instructor courses retrieved successfully', courses);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new course
 * @route   POST /courses
 * @access  Private (Instructor/Admin)
 */
const createCourse = async (req, res, next) => {
  try {
    const { title, description, category, price } = req.body;

    if (!title || !description || !category) {
      return sendError(res, 'Title, description and category are required', 400);
    }

    const course = await Course.create({
      title,
      description,
      instructor: req.user._id,
      category,
      price: price || 0,
    });

    return sendSuccess(res, 'Course created successfully', course, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update course
 * @route   PUT /courses/:id
 * @access  Private (Instructor/Admin)
 */
const updateCourse = async (req, res, next) => {
  try {
    const { title, description, category, price } = req.body;

    let course = await Course.findById(req.params.id);

    if (!course) {
      return sendError(res, 'Course not found', 404);
    }

    // Authorization check
    if (
      req.user.role !== 'admin' &&
      course.instructor.toString() !== req.user._id.toString()
    ) {
      return sendError(res, 'Not authorized to edit this course', 403);
    }

    course = await Course.findByIdAndUpdate(
      req.params.id,
      { title, description, category, price },
      { new: true, runValidators: true }
    );

    return sendSuccess(res, 'Course updated successfully', course);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete course with related data cleanup
 * @route   DELETE /courses/:id
 * @access  Private (Instructor/Admin)
 */
const deleteCourse = async (req, res, next) => {
  try {
    const courseId = req.params.id;

    const course = await Course.findById(courseId);

    if (!course) {
      return sendError(res, 'Course not found', 404);
    }

    // Authorization check
    if (
      req.user.role !== 'admin' &&
      course.instructor.toString() !== req.user._id.toString()
    ) {
      return sendError(res, 'Not authorized to delete this course', 403);
    }

    // Delete course
    await Course.findByIdAndDelete(courseId);

    // Cascade delete related lessons
    await Lesson.deleteMany({ course: courseId });

    // Cascade delete related enrollments
    await Enrollment.deleteMany({ course: courseId });

    return sendSuccess(res, 'Course and related data deleted successfully', {
      id: courseId,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  getInstructorCourses,
  createCourse,
  updateCourse,
  deleteCourse,
};