const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendError } = require('../utils/responseHandler');

/**
 * Middleware to protect routes by verifying JWT tokens.
 * Ensures that only authenticated users can access protected endpoints.
 */
const protect = async (req, res, next) => {
  let token;

  // Check if authorization header exists and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token using secret key
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'super_secret_lms_key'
      );

      // Attach user to request object
      req.user = await User.findById(decoded.id);

      // If user not found, return error
      if (!req.user) {
        return sendError(res, 'Not authorized, user not found', 401);
      }

      // Proceed to next middleware
      next();
    } catch (error) {
      console.error(error);
      return sendError(res, 'Not authorized, token failed', 401);
    }
  }

  // If no token provided, return error
  if (!token) {
    return sendError(res, 'Not authorized, no token', 401);
  }
};

module.exports = { protect };
