'use strict';

const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const service = require('./task.service');

const create = asyncHandler(async (req, res) => {
  const task = await service.create({
    ownerId: req.user.id,
    data: req.body,
    file: req.file,
  });
  return ApiResponse.created(res, task, 'Task created');
});

const list = asyncHandler(async (req, res) => {
  const result = await service.list(req.query);
  return ApiResponse.ok(res, result);
});

const getById = asyncHandler(async (req, res) => {
  const task = await service.getById(req.params.id);
  return ApiResponse.ok(res, task);
});

const update = asyncHandler(async (req, res) => {
  const task = await service.update({
    id: req.params.id,
    ownerId: req.user.id,
    patch: req.body,
    file: req.file,
  });
  return ApiResponse.ok(res, task, 'Task updated');
});

const remove = asyncHandler(async (req, res) => {
  await service.delete({ id: req.params.id, ownerId: req.user.id });
  return ApiResponse.ok(res, null, 'Task deleted');
});

module.exports = { create, list, getById, update, remove };
