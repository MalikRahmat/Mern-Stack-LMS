const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const { sendSuccess } = require('../utils/responseHandler');

/**
 * @desc    Retrieve dashboard analytics
 * @route   GET /analytics
 * @access  Private (Admin/Instructor)
 */
const getAnalytics = async (req, res, next) => {
  try {
    // Fetch user statistics
    const totalUsers = await User.countDocuments({});
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalInstructors = await User.countDocuments({ role: 'instructor' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });

    // Fetch course and enrollment counts
    const totalCourses = await Course.countDocuments({});
    const totalEnrollments = await Enrollment.countDocuments({});

    // Category breakdown using aggregation pipeline
    const categoryBreakdown = await Course.aggregate([
      {
        $group: {
          _id: { $ifNull: ["$category", "General"] },
          value: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          value: 1
        }
      }
    ]);

    // Determine most popular courses based on enrollments
    const popularCourses = await Enrollment.aggregate([
      {
        $group: {
          _id: "$course",
          enrollmentCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "_id",
          as: "courseInfo"
        }
      },
      {
        $unwind: {
          path: "$courseInfo",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 0,
          title: { $ifNull: ["$courseInfo.title", "Deleted Course"] },
          enrollmentCount: 1
        }
      },
      {
        $sort: { enrollmentCount: -1 }
      }
    ]);

    // Send structured analytics response
    return sendSuccess(res, 'Analytics retrieved successfully', {
      usersSummary: {
        total: totalUsers,
        students: totalStudents,
        instructors: totalInstructors,
        admins: totalAdmins,
      },
      coursesSummary: {
        total: totalCourses,
        categoryBreakdown,
      },
      enrollmentsSummary: {
        total: totalEnrollments,
        popularCourses,
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnalytics,
};