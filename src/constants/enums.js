'use strict';

const EXPERIENCE_LEVELS = Object.freeze({
  FRESH: 'fresh',
  JUNIOR: 'junior',
  MID: 'mid',
  SENIOR: 'senior',
  LEAD: 'lead',
});

const ROLES = Object.freeze({
  USER: 'user',
  ADMIN: 'admin',
});

const TASK_STATUS = Object.freeze({
  WAITING: 'waiting',
  IN_PROGRESS: 'in_progress',
  FINISHED: 'finished',
});

const TASK_PRIORITY = Object.freeze({
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
});

module.exports = {
  EXPERIENCE_LEVELS,
  EXPERIENCE_LEVEL_VALUES: Object.values(EXPERIENCE_LEVELS),
  ROLES,
  ROLE_VALUES: Object.values(ROLES),
  TASK_STATUS,
  TASK_STATUS_VALUES: Object.values(TASK_STATUS),
  TASK_PRIORITY,
  TASK_PRIORITY_VALUES: Object.values(TASK_PRIORITY),
};
