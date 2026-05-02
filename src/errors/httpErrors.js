'use strict';

const { StatusCodes } = require('http-status-codes');
const AppError = require('./AppError');

class BadRequestError extends AppError {
  constructor(message = 'Bad Request', details) {
    super(message, StatusCodes.BAD_REQUEST, 'BAD_REQUEST', details);
  }
}

class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized', details) {
    super(message, StatusCodes.UNAUTHORIZED, 'UNAUTHORIZED', details);
  }
}

class ForbiddenError extends AppError {
  constructor(message = 'Forbidden', details) {
    super(message, StatusCodes.FORBIDDEN, 'FORBIDDEN', details);
  }
}

class RefreshFailedError extends AppError {
  constructor(message = 'Refresh failed, please login again', details) {
    super(message, StatusCodes.FORBIDDEN, 'REFRESH_FAILED', details);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Not Found', details) {
    super(message, StatusCodes.NOT_FOUND, 'NOT_FOUND', details);
  }
}

class ConflictError extends AppError {
  constructor(message = 'Conflict', details) {
    super(message, StatusCodes.CONFLICT, 'CONFLICT', details);
  }
}

class ValidationError extends AppError {
  constructor(message = 'Validation Error', details) {
    super(message, StatusCodes.UNPROCESSABLE_ENTITY, 'VALIDATION_ERROR', details);
  }
}

module.exports = {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  RefreshFailedError,
  NotFoundError,
  ConflictError,
  ValidationError,
};
