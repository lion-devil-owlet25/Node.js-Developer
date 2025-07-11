const { User } = require('../models');
const fs = require('fs');
const path = require('path');

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, gender, role } = req.body;
    
    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    
    // Create user with role and track who created
    const newUser = await User.create({
      name,
      email,
      password,
      gender,
      role: role || 'Manager',
      createdBy: req.user.role,
      image: req.file ? `/uploads/${req.file.filename}` : null
    });
    
    // Respond without including password
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        gender: newUser.gender,
        role: newUser.role,
        image: newUser.image,
        createdBy: newUser.createdBy,
        createdAt: newUser.createdAt
      }
    });
    
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ 
      message: 'Error creating user', 
      error: error.message 
    });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json({
      message: 'Users fetched successfully',
      count: users.length,
      users
    });
    
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ 
      message: 'Error fetching users', 
      error: error.message 
    });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({
      message: 'User fetched successfully',
      user
    });
    
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ 
      message: 'Error fetching user', 
      error: error.message 
    });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { name, email, gender, role } = req.body;
    const userId = req.params.id;
    
    // Find user by ID
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if email is taken by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered to another user' });
      }
    }
    
    // Update user fields
    const updateData = {
      ...(name && { name }),
      ...(email && { email }),
      ...(gender && { gender }),
      ...(role && { role })
    };
    
    // Handle image update
    if (req.file) {
      // If user has an existing image, delete it
      if (user.image) {
        const oldImagePath = path.join(__dirname, '..', user.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updateData.image = `/uploads/${req.file.filename}`;
    }
    
    // Update user
    await user.update(updateData);
    
    // Fetch updated user (without password)
    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });
    
    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser
    });
    
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ 
      message: 'Error updating user', 
      error: error.message 
    });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Find user by ID
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Delete user's image if it exists
    if (user.image) {
      const imagePath = path.join(__dirname, '..', user.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    // Delete user
    await user.destroy();
    
    res.status(200).json({
      message: 'User deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ 
      message: 'Error deleting user', 
      error: error.message 
    });
  }
};