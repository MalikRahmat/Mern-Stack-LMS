const sendEmail = require('../utils/sendEmail');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { hashPassword, comparePassword } = require('../utils/hashPassword');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const crypto = require('crypto');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role, phone } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return sendError(res, 'Please provide all required fields', 400);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return sendError(res, 'Invalid email format. Please enter a valid email address.', 400);
    }

    // Restrict privileged role creation from public registration
    if (role && role !== 'student') {
      return sendError(
        res,
        'Access Denied. Registration for Instructors or Admins must be handled by Management.',
        403
      );
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return sendError(res, 'User already exists with this email', 400);
    }

    // Hash password before saving
    const hashedPassword = await hashPassword(password);

    // Create new user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'student',
      phone: phone || '',
    });

    if (!user) {
      return sendError(res, 'Invalid user data', 400);
    }

    return sendSuccess(
      res,
      'User registered successfully',
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        bio: user.bio || '', 
        profilePicture: user.profilePicture || '',
        token: generateToken(user._id, user.role),
      },
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user and return token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 'Please provide email and password', 400);
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return sendError(res, 'Invalid email or password', 401);
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return sendError(res, 'Invalid email or password', 401);
    }

    return sendSuccess(res, 'Logged in successfully', {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || '',
      bio: user.bio || '', 
      profilePicture: user.profilePicture || '', 
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    return sendSuccess(res, 'User profile retrieved', {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || '',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Initiate forgot password process
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return sendError(res, 'Please provide an email address.', 400);
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return sendError(res, 'No account found with this email address.', 404);
    }

    // Generate secure reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const htmlMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e4e4e4; border-radius: 5px;">
        <h2 style="text-align: center;">LMS Password Reset Request</h2>
        <p>Hello ${user.name},</p>
        <p>A request was received to reset your password.</p>
        <p>This link is valid for 15 minutes only.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" target="_blank" style="background-color: #0d6efd; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 4px;">
            Reset Password
          </a>
        </div>
        <p style="font-size: 12px; color: #666;">
          If you did not request this, please ignore this email.
        </p>
      </div>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'LMS Portal - Password Reset Request',
        htmlMessage,
      });

      return sendSuccess(res, 'Password reset instructions sent to email.');
    } catch (emailError) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      return sendError(res, 'Email could not be sent.', 500);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reset password using token
 * @route   POST /api/auth/reset-password/:token
 * @access  Public
 */
const resetPassword = async (req, res, next) => {
  try {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return sendError(res, 'Invalid or expired reset token.', 400);
    }

    user.password = await hashPassword(req.body.password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return sendSuccess(res, 'Password updated successfully.');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  forgotPassword,
  resetPassword,
};