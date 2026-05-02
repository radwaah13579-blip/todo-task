'use strict';

const express = require('express');
const controller = require('./task.controller');
const {
  createTaskSchema,
  updateTaskSchema,
  taskIdParamSchema,
  listTasksSchema,
} = require('./task.validator');
const validate = require('../../middlewares/validate');
const authenticate = require('../../middlewares/authenticate');
const { singleImage } = require('../../middlewares/upload');

const router = express.Router();

router.use(authenticate);

router.post('/', singleImage('image'), validate(createTaskSchema), controller.create);
router.get('/', validate(listTasksSchema), controller.list);
router.get('/:id', validate(taskIdParamSchema), controller.getById);
router.patch('/:id', singleImage('image'), validate(updateTaskSchema), controller.update);
router.delete('/:id', validate(taskIdParamSchema), controller.remove);

module.exports = router;
