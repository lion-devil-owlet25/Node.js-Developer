const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const { authenticate, authorize, hasPermission } = require('../middlewares/auth.middleware');

// All task routes require authentication
router.use(authenticate);

// Create task - Admin and Manager can add tasks
router.post(
  '/',
  hasPermission('Task', 'add'),
  taskController.createTask
);

// Get all tasks - Admin, Super-admin, Manager can view tasks
router.get(
  '/',
  hasPermission('Task', 'view'),
  taskController.getAllTasks
);

// Get task by ID - Admin, Super-admin, Manager can view task details
router.get(
  '/:id',
  hasPermission('Task', 'view'),
  taskController.getTaskById
);

// Update task - Admin can update tasks
router.put(
  '/:id',
  hasPermission('Task', 'update'),
  taskController.updateTask
);

// Delete task - Admin and Super-admin can delete tasks
router.delete(
  '/:id',
  hasPermission('Task', 'delete'),
  taskController.deleteTask
);

module.exports = router;