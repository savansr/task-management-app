const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Task = require('./models/Task');
require('dotenv').config();

const seedUsers = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
  },
  {
    name: 'Regular User',
    email: 'user@example.com',
    password: 'user123',
  },
  {
    name: 'Test User',
    email: 'test@example.com',
    password: 'test123',
  }
];

const seedTasks = [
  {
    title: 'Complete Project Documentation',
    description: 'Write comprehensive documentation for the task management application',
    priority: 'high',
    status: 'incomplete'
  },
  {
    title: 'Implement Task Filtering',
    description: 'Add functionality to filter tasks by status and priority',
    priority: 'medium',
    status: 'complete'
  },
  {
    title: 'Update UI Styling',
    description: 'Improve the visual design of the application',
    priority: 'low',
    status: 'incomplete'
  },
  {
    title: 'Fix Authentication Bug',
    description: 'Resolve the issue with JWT token expiration',
    priority: 'high',
    status: 'incomplete'
  },
  {
    title: 'Add Task Categories',
    description: 'Implement the ability to categorize tasks',
    priority: 'medium',
    status: 'incomplete'
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Task.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const createdUsers = await Promise.all(
      seedUsers.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return User.create({
          name: user.name,
          email: user.email,
          password: hashedPassword
        });
      })
    );
    console.log('Created users');

    // Create tasks for each user
    for (const user of createdUsers) {
      const userTasks = seedTasks.map(task => ({
        ...task,
        user: user._id
      }));
      await Task.insertMany(userTasks);
    }
    console.log('Created tasks');

    console.log('Database seeded successfully!');
    console.log('\nTest Users:');
    seedUsers.forEach(user => {
      console.log(`Email: ${user.email}`);
      console.log(`Password: ${user.password}`);
      console.log('---');
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 