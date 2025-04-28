const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { protect } = require('../middleware/authMiddleware');
const Task = require('../models/Task');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
router.get('/', protect, asyncHandler(async (req, res) => {
  const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(tasks);
}));

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
router.post('/', protect, asyncHandler(async (req, res) => {
  const { title, description, priority } = req.body;

  const task = await Task.create({
    title,
    description,
    priority,
    user: req.user._id
  });

  res.status(201).json(task);
}));

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
router.put('/:id', protect, asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Check for user
  if (task.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  const updatedTask = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updatedTask);
}));

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
router.delete('/:id', protect, asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // Check for user
  if (task.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized');
  }

  await Task.deleteOne({ _id: req.params.id });
  res.json({ message: 'Task removed' });
}));

module.exports = router; 