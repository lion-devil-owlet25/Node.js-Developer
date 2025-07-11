const sequelize = require('../config/database');
const User = require('./user.model');
const Task = require('./task.model');

// Define relationships
User.hasMany(Task, {
  foreignKey: 'userId',
  as: 'tasks'
});

Task.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

module.exports = {
  sequelize,
  User,
  Task
};