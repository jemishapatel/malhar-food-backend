const ApiResponse = require('../utils/apiResponse');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// JWT authentication middleware
module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ApiResponse.error(res, 401, 'Unauthorized request access denied', 'No token provided');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mysecretkey123');

    const user = await User.findById(decoded.userId);
    if (!user) {
      return ApiResponse.error(res, 401, 'Unauthorized request access denied', 'User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    return ApiResponse.error(res, 401, 'Unauthorized request access denied', error.message);
  }
};
