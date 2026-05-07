require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Project.deleteMany();
    await Task.deleteMany();

    // Create Admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@taskflow.com',
      password: 'password123',
      role: 'admin'
    });

    // Create Member
    const member = await User.create({
      name: 'Team Member',
      email: 'member@taskflow.com',
      password: 'password123',
      role: 'member'
    });

    // Create Project
    const project = await Project.create({
      name: 'Website Redesign',
      description: 'Modernizing the company landing page with React and Tailwind.',
      owner: admin._id,
      members: [admin._id, member._id]
    });

    // Create Tasks
    await Task.create([
      {
        title: 'Design Hero Section',
        description: 'Create a high-fidelity mockup of the hero section.',
        project: project._id,
        createdBy: admin._id,
        assignedTo: member._id,
        priority: 'high',
        status: 'in-progress',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Setup API Endpoints',
        description: 'Implement backend routes for user profiles.',
        project: project._id,
        createdBy: admin._id,
        assignedTo: admin._id,
        priority: 'medium',
        status: 'pending',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      }
    ]);

    console.log('Data seeded successfully!');
    process.exit();
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
};

seed();
