'use strict';

const Joi = require('joi');
const {
  TASK_PRIORITY_VALUES,
  TASK_STATUS_VALUES,
} = require('../../constants/enums');
const { objectIdSchema } = require('../../validators/common');

const dueDateSchema = Joi.date().iso().greater('now');

const createTaskSchema = {
  body: Joi.object({
    title: Joi.string().trim().min(2).max(120).required(),
    description: Joi.string().trim().min(2).max(2000).required(),
    priority: Joi.string().valid(...TASK_PRIORITY_VALUES).required(),
    dueDate: dueDateSchema.required(),
  }),
};

const updateTaskSchema = {
  body: Joi.object({
    title: Joi.string().trim().min(2).max(120),
    description: Joi.string().trim().min(2).max(2000),
    priority: Joi.string().valid(...TASK_PRIORITY_VALUES),
    dueDate: Joi.date().iso(),
    status: Joi.string().valid(...TASK_STATUS_VALUES),
  }).min(1),
  params: Joi.object({ id: objectIdSchema.required() }),
};

const taskIdParamSchema = {
  params: Joi.object({ id: objectIdSchema.required() }),
};

const listTasksSchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    status: Joi.string().valid(...TASK_STATUS_VALUES),
    priority: Joi.string().valid(...TASK_PRIORITY_VALUES),
    sort: Joi.string()
      .valid('createdAt', '-createdAt', 'dueDate', '-dueDate', 'priority', '-priority')
      .default('-createdAt'),
  }),
};

module.exports = {
  createTaskSchema,
  updateTaskSchema,
  taskIdParamSchema,
  listTasksSchema,
};
