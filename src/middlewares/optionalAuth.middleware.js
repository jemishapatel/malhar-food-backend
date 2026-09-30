import User from '../models/User.js';
import jwt from 'jsonwebtoken';

/**
 * Optional authentication middleware.
 * - If a valid Bearer token is provided, attaches the user to req.user.
 * - If no token (or an invalid one) is provided, req.user is left as null/undefined
 *   and the request is allowed to proceed as a guest.
 *
 * Used for routes that should work for both authenticated users AND guest users.
 */
const optionalAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mysecretkey123');
      const user = await User.findById(decoded.userId);
      if (user) {
        req.user = user;
      }
    }
  } catch (error) {
    // Token invalid or expired — treat as guest, do not block the request
    req.user = null;
  }

  next();
};

export default optionalAuthMiddleware;
