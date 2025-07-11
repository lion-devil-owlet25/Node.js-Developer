const { Task, User } = require('../models');

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { name, description, taskType, startDate, endDate } = req.body;
    
    // Create task
    const newTask = await Task.create({
      name,
      description,
      taskType,
      startDate,
      endDate,
      createdBy: req.user.role,
      userId: req.user.id
    });
    
    res.status(201).json({
      message: 'Task created successfully',
      task: newTask
    });
    
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ 
      message: 'Error creating task', 
      error: error.message 
    });
  }
};

// Get all tasks
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'role']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json({
      message: 'Tasks fetched successfully',
      count: tasks.length,
      tasks
    });
    
  } catch (error) {
    console.error('Get all tasks error:', error);
    res.status(500).json({ 
      message: 'Error fetching tasks', 
      error: error.message 
    });
  }
};

// Get task by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'role']
        }
      ]
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.status(200).json({
      message: 'Task fetched successfully',
      task
    });
    
  } catch (error) {
    console.error('Get task by ID error:', error);
    res.status(500).json({ 
      message: 'Error fetching task', 
      error: error.message 
    });
  }
};

// Update task
exports.updateTask = async (req, res) => {
  try {
    const { name, description, taskType, startDate, endDate } = req.body;
    const taskId = req.params.id;
    
    // Find task by ID
    const task = await Task.findByPk(taskId);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Update task
    await task.update({
      ...(name && { name }),
      ...(description !== undefined && { description }),
      ...(taskType && { taskType }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate })
    });
    
    // Fetch updated task with user info
    const updatedTask = await Task.findByPk(taskId, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'role']
        }
      ]
    });
    
    res.status(200).json({
      message: 'Task updated successfully',
      task: updatedTask
    });
    
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ 
      message: 'Error updating task', 
      error: error.message 
    });
  }
};

// Delete task
exports.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    
    // Find task by ID
    const task = await Task.findByPk(taskId);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Delete task
    await task.destroy();
    
    res.status(200).json({
      message: 'Task deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ 
      message: 'Error deleting task', 
      error: error.message 
    });
  }
};