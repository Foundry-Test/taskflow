const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Task extends Model {}

Task.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Title cannot be empty',
        },
        len: {
          args: [1, 255],
          msg: 'Title must be between 1 and 255 characters',
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    priority: {
      type: DataTypes.ENUM('high', 'medium', 'low'),
      allowNull: false,
      defaultValue: 'medium',
      validate: {
        isIn: {
          args: [['high', 'medium', 'low']],
          msg: 'Priority must be one of: high, medium, low',
        },
      },
    },
    status: {
      type: DataTypes.ENUM('todo', 'in_progress', 'done'),
      allowNull: false,
      defaultValue: 'todo',
      validate: {
        isIn: {
          args: [['todo', 'in_progress', 'done']],
          msg: 'Status must be one of: todo, in_progress, done',
        },
      },
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null,
      field: 'due_date',
      validate: {
        isDate: {
          msg: 'Due date must be a valid date',
        },
      },
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
      field: 'completed_at',
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'Task',
    tableName: 'tasks',
    underscored: true,
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        fields: ['priority'],
        name: 'tasks_priority_idx',
      },
      {
        fields: ['status'],
        name: 'tasks_status_idx',
      },
      {
        fields: ['user_id'],
        name: 'tasks_user_id_idx',
      },
      {
        fields: ['due_date'],
        name: 'tasks_due_date_idx',
      },
      {
        fields: ['priority', 'status'],
        name: 'tasks_priority_status_idx',
      },
    ],
    scopes: {
      highPriority: {
        where: { priority: 'high' },
      },
      mediumPriority: {
        where: { priority: 'medium' },
      },
      lowPriority: {
        where: { priority: 'low' },
      },
      byPriority: (priority) => ({
        where: { priority },
      }),
      incomplete: {
        where: {
          status: ['todo', 'in_progress'],
        },
      },
      completed: {
        where: { status: 'done' },
      },
    },
  }
);

Task.getPriorityOrder = function () {
  return { high: 1, medium: 2, low: 3 };
};

Task.filterByPriority = async function (priority, options = {}) {
  const validPriorities = ['high', 'medium', 'low'];
  if (!validPriorities.includes(priority)) {
    throw new Error(`Invalid priority: ${priority}. Must be one of: ${validPriorities.join(', ')}`);
  }
  return this.findAll({ where: { priority }, ...options });
};

Task.prototype.isHighPriority = function () {
  return this.priority === 'high';
};

Task.prototype.isMediumPriority = function () {
  return this.priority === 'medium';
};

Task.prototype.isLowPriority = function () {
  return this.priority === 'low';
};

Task.prototype.escalatePriority = async function () {
  const priorityLevels = ['low', 'medium', 'high'];
  const currentIndex = priorityLevels.indexOf(this.priority);
  if (currentIndex < priorityLevels.length - 1) {
    this.priority = priorityLevels[currentIndex + 1];
    await this.save();
  }
  return this;
};

Task.prototype.降级Priority = async function () {
  const priorityLevels = ['low', 'medium', 'high'];
  const currentIndex = priorityLevels.indexOf(this.priority);
  if (currentIndex > 0) {
    this.priority = priorityLevels[currentIndex - 1];
    await this.save();
  }
  return this;
};

Task.prototype.toJSON = function () {
  const values = { ...this.get() };
  const priorityMeta = {
    high: { label: 'High', color: '#ef4444', order: 1 },
    medium: { label: 'Medium', color: '#f59e0b', order: 2 },
    low: { label: 'Low', color: '#22c55e', order: 3 },
  };
  values.priorityMeta = priorityMeta[values.priority] || null;
  return values;
};

module.exports = Task;