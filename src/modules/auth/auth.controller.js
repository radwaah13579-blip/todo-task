'use strict';

const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/ApiResponse');
const service = require('./auth.service');

const signup = asyncHandler(async (req, res) => {
  const result = await service.signup(req.body);
  return ApiResponse.created(res, result, 'Account created');
});

const login = asyncHandler(async (req, res) => {
  const result = await service.login(req.body);
  return ApiResponse.ok(res, result, 'Logged in');
});

const refresh = asyncHandler(async (req, res) => {
  const result = await service.refresh(req.body.refreshToken);
  return ApiResponse.ok(res, result, 'Tokens refreshed');
});

const logout = asyncHandler(async (req, res) => {
  await service.logout(req.user.id);
  return ApiResponse.ok(res, null, 'Logged out');
});

module.exports = { signup, login, refresh, logout };
