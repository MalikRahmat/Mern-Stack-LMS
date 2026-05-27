const User = require('../models/User');
const Course = require('../models/Course');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { hashPassword } = require('../utils/hashPassword');

/**
 * @desc    Get all users
 * @route   GET /admin/users
 * @access  Private (Admin)
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({});

    const responseUsers = users.map((user) => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || '',
      createdAt: user.createdAt,
    }));

    return sendSuccess(res, 'All users retrieved successfully', responseUsers);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single user details
 * @route   GET /admin/users/:id
 * @access  Private (Admin)
 */
const getUserDetails = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return sendError(res, 'User profile not found inside the registry.', 404);
    }

    return sendSuccess(res, 'User profile details retrieved successfully', user);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create instructor (Admin only)
 * @route   POST /admin/instructors
 * @access  Private (Admin)
 */
const createInstructor = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return sendError(res, 'Please provide Name, Email and Password.', 400);
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });

    if (userExists) {
      return sendError(
        res,
        'A user or instructor already exists with this email.',
        400
      );
    }

    const hashedPassword = await hashPassword(password);

    const instructor = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'instructor',
      phone: phone || '',
    });

    return sendSuccess(
      res,
      'Instructor registered successfully by Admin!',
      {
        _id: instructor._id,
        name: instructor.name,
        email: instructor.email,
        role: instructor.role,
        phone: instructor.phone,
      },
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Admin reset user password
 * @route   PATCH /admin/users/reset-password
 * @access  Private (Admin)
 */
const adminResetUserPassword = async (req, res, next) => {
  try {
    const { userId, newPassword } = req.body;

    if (!userId || !newPassword) {
      return sendError(
        res,
        'Target User ID and New Secure Password are required.',
        400
      );
    }

    if (newPassword.length < 6) {
      return sendError(
        res,
        'Password must be at least 6 characters long for system compliance.',
        400
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return sendError(res, 'Target user record not found.', 404);
    }

    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;

    await user.save();

    return sendSuccess(
      res,
      `Password for ${user.name} (${user.role}) has been overridden successfully!`
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Replace instructor across courses
 * @route   PATCH /admin/instructors/replace
 * @access  Private (Admin)
 */
const replaceInstructor = async (req, res, next) => {
  try {
    const { oldInstructorId, newInstructorId } = req.body;

    if (!oldInstructorId || !newInstructorId) {
      return sendError(
        res,
        'Please provide both Old and New Instructor IDs.',
        400
      );
    }

    const newInstructor = await User.findOne({
      _id: newInstructorId,
      role: 'instructor',
    });

    if (!newInstructor) {
      return sendError(
        res,
        'Valid New Instructor not found with the provided ID.',
        404
      );
    }

    const updateResult = await Course.updateMany(
      { instructor: oldInstructorId },
      { instructor: newInstructorId }
    );

    return sendSuccess(
      res,
      `Successfully reassigned ${updateResult.modifiedCount} courses to ${newInstructor.name}.`,
      {
        modifiedCount: updateResult.modifiedCount,
      }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete user safely
 * @route   DELETE /admin/users/:id
 * @access  Private (Admin)
 */
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    if (user.role === 'instructor') {
      const activeCoursesCount = await Course.countDocuments({
        instructor: user._id,
      });

      if (activeCoursesCount > 0) {
        return sendError(
          res,
          `Cannot delete instructor. This instructor is currently teaching ${activeCoursesCount} active course(s). Please use the 'Replace Instructor' feature first.`,
          400
        );
      }
    }

    await User.findByIdAndDelete(req.params.id);

    return sendSuccess(res, 'User deleted successfully', {
      id: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update authenticated logged-in user profile
 * @route   PUT /api/users/profile
 * @access  Private (Student/Instructor/Admin)
 */
const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return sendError(res, 'Authentication context token is missing valid user ID.', 401);
    }

    const user = await User.findById(userId);

    if (!user) {
      return sendError(res, 'Active session context user account not found.', 404);
    }

    //  Using explicit assignment to ensure empty strings or new values are successfully updated
    user.name = req.body.name !== undefined ? req.body.name : user.name;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
    user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;

    // Check if multer parsed image storage path successfully
    if (req.file) {
      // Normalize backslashes into standard web URL forward slashes (e.g., uploads/profiles/abc.png)
      user.profilePicture = req.file.path.replace(/\\/g, '/');
    }

    const updatedUser = await user.save();

    // Mapping secure response context with defaults to ensure frontend state never remains blank
    const userResponse = {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone || '',
      bio: updatedUser.bio || '',
      profilePicture: updatedUser.profilePicture || '',
      createdAt: updatedUser.createdAt,
    };

    return sendSuccess(res, 'User profile configuration modified successfully.', userResponse);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserDetails,
  createInstructor,
  adminResetUserPassword,
  replaceInstructor,
  deleteUser,
  updateUserProfile,
};