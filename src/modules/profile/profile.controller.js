'use strict';

const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const service = require('./profile.service');

const getMe = asyncHandler(async (req, res) => {
  const profile = await service.getById(req.user.id);
  return ApiResponse.ok(res, profile);
});

const updateMe = asyncHandler(async (req, res) => {
  const profile = await service.updateById(req.user.id, req.body);
  return ApiResponse.ok(res, profile, 'Profile updated');
});

const getById = asyncHandler(async (req, res) => {
  const profile = await service.getById(req.params.id);
  return ApiResponse.ok(res, profile);
});

module.exports = { getMe, updateMe, getById };
