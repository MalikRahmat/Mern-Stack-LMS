const { sendError } = require('../utils/responseHandler');

const authorize = (...roles) => {
  return (req, res, next) => {
    if (req.user && roles.includes(req.user.role)) {
      next();
    } else {
      return sendError(res, `Forbidden: role '${req.user ? req.user.role : 'none'}' does not have access`, 403);
    }
  };
};

module.exports = { authorize };
