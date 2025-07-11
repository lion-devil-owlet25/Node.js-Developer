const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Task name is required'
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  taskType: {
    type: DataTypes.STRING,
    allowNull: false,
    get() {
      // Return array from comma-separated string
      const rawValue = this.getDataValue('taskType');
      return rawValue ? rawValue.split(',') : [];
    },
    set(val) {
      // Store array as comma-separated string
      if (Array.isArray(val)) {
        this.setDataValue('taskType', val.join(','));
      } else {
        this.setDataValue('taskType', val);
      }
    },
    validate: {
      customValidator(value) {
        const types = Array.isArray(value) ? value : value.split(',');
        const validTypes = ['a-task', 'b-task', 'c-task', 'd-task', 'e-task'];
        
        for (const type of types) {
          if (!validTypes.includes(type.trim())) {
            throw new Error(`Task type must be one of: ${validTypes.join(', ')}`);
          }
        }
      }
    }
  },
  createdBy: {
    type: DataTypes.STRING,
    allowNull: false
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: {
        msg: 'Start date must be a valid date'
      }
    }
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: {
        msg: 'End date must be a valid date'
      },
      isAfterStartDate(value) {
        if (new Date(value) <= new Date(this.startDate)) {
          throw new Error('End date must be after start date');
        }
      }
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: true
});

module.exports = Task;