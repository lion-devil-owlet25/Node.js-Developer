const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate, authorize, hasPermission } = require('../middlewares/auth.middleware');
const { upload } = require('../middlewares/upload.middleware');

// All user routes require authentication
router.use(authenticate);

// Create user - Admin can add users
router.post(
  '/',
  hasPermission('User', 'add'),
  upload.single('image'),
  userController.createUser
);

// Get all users - Admin, Super-admin, Manager can view users
router.get(
  '/',
  hasPermission('User', 'view'),
  userController.getAllUsers
);

// Get user by ID - Admin, Super-admin, Manager can view user details
router.get(
  '/:id',
  hasPermission('User', 'view'),
  userController.getUserById
);

// Update user - Admin can update users
router.put(
  '/:id',
  hasPermission('User', 'update'),
  upload.single('image'),
  userController.updateUser
);

// Delete user - Admin and Super-admin can delete users
router.delete(
  '/:id',
  hasPermission('User', 'delete'),
  userController.deleteUser
);

module.exports = router;