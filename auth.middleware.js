const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Authentication middleware - verify JWT token
exports.authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied. No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user exists
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token - user not found' });
    }
    
    // Attach user to request object
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Role-based authorization middleware
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Access denied. Role '${req.user.role}' is not authorized.` 
      });
    }
    
    next();
  };
};

// Permission-based authorization middleware
exports.hasPermission = (resource, action) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const role = req.user.role;
    
    // Define permissions based on the requirements
    const permissions = {
      'Super-admin': {
        User: ['view', 'delete'],
        Task: ['view', 'delete']
      },
      'Admin': {
        User: ['add', 'update', 'delete', 'view'],
        Task: ['add', 'update', 'delete', 'view']
      },
      'Manager': {
        User: ['view'],
        Task: ['add', 'view']
      }
    };
    
    // Check if the user has the required permission
    if (!permissions[role] || 
        !permissions[role][resource] || 
        !permissions[role][resource].includes(action)) {
      return res.status(403).json({
        message: `Access denied. ${role} does not have permission to ${action} ${resource}`
      });
    }
    
    next();
  };
};