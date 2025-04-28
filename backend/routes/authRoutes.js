const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Helper function to format user data
const formatUserData = (user, includeToken = false) => {
  const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,
  };
  
  if (includeToken) {
    userData.token = generateToken(user._id);
  }
  
  return userData;
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, asyncHandler(async (req, res) => {
  console.log('GET /me - User:', req.user);
  const userData = formatUserData(req.user);
  res.json(userData);
}));

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  console.log('Register request:', { name, email });

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    const userData = formatUserData(user, true);
    console.log('User registered:', userData);
    res.status(201).json(userData);
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
}));

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log('Login request:', { email });

  // Check for user email
  const user = await User.findOne({ email }).select('+password');

  if (user && (await user.comparePassword(password))) {
    const userData = formatUserData(user, true);
    console.log('User logged in:', userData);
    res.json(userData);
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
}));

module.exports = router; 