const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  console.log('Auth middleware - Headers:', req.headers);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      console.log('Auth middleware - Token found:', token);

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Auth middleware - Token decoded:', decoded);

      // Get user from the token
      const user = await User.findById(decoded.id).select('-password');
      console.log('Auth middleware - User found:', user);

      if (!user) {
        console.log('Auth middleware - No user found for token');
        return res.status(401).json({ message: 'User not found' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Auth middleware - Error:', error);
      return res.status(401).json({ message: 'Not authorized' });
    }
  }

  if (!token) {
    console.log('Auth middleware - No token found');
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect }; 