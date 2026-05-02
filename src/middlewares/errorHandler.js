'use strict';

const { StatusCodes } = require('http-status-codes');
const AppError = require('../errors/AppError');
const env = require('../config/env');
const logger = require('../utils/logger');

function mapMongooseError(err) {
  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map((e) => ({
      path: e.path,
      message: e.message,
    }));
    return new AppError('Validation failed', StatusCodes.UNPROCESSABLE_ENTITY, 'VALIDATION_ERROR', details);
  }
  if (err.name === 'CastError') {
    return new AppError(`Invalid value for ${err.path}`, StatusCodes.BAD_REQUEST, 'BAD_REQUEST');
  }
  if (err.code === 11000) {
    const fields = Object.keys(err.keyValue || {});
    return new AppError('Duplicate value', StatusCodes.CONFLICT, 'CONFLICT', { fields });
  }
  return null;
}

function notFoundHandler(req, _res, next) {
  next(new AppError(`Route ${req.method} ${req.originalUrl} not found`, StatusCodes.NOT_FOUND, 'NOT_FOUND'));
}

function errorHandler(err, req, res, _next) {
  let normalized = err instanceof AppError ? err : mapMongooseError(err);

  if (!normalized) {
    normalized = new AppError(
      env.isProd ? 'Internal Server Error' : err.message,
      err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      err.code || 'INTERNAL_ERROR'
    );
  }

  if (normalized.statusCode >= 500) {
    logger.error(normalized.message, { stack: err.stack, path: req.originalUrl });
  }

  const body = {
    success: false,
    error: {
      code: normalized.code,
      message: normalized.message,
      ...(normalized.details ? { details: normalized.details } : {}),
    },
  };

  if (!env.isProd && err.stack) body.error.stack = err.stack;

  res.status(normalized.statusCode).json(body);
}

module.exports = { errorHandler, notFoundHandler };
