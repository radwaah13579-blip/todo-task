'use strict';

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const env = require('../config/env');

function sanitizeInPlace(obj) {
  if (!obj || typeof obj !== 'object') return;
  for (const key of Object.keys(obj)) {
    if (key.startsWith('$') || key.includes('.')) {
      delete obj[key];
      continue;
    }
    const value = obj[key];
    if (value && typeof value === 'object') sanitizeInPlace(value);
  }
}

function mongoSanitize(req, _res, next) {
  sanitizeInPlace(req.body);
  sanitizeInPlace(req.params);
  if (req.query) {
    for (const key of Object.keys(req.query)) {
      if (key.startsWith('$') || key.includes('.')) delete req.query[key];
      else if (req.query[key] && typeof req.query[key] === 'object') sanitizeInPlace(req.query[key]);
    }
  }
  next();
}

function applySecurity(app) {
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors());
  app.use(mongoSanitize);

  const limiter = rateLimit({
    windowMs: env.rateLimit.windowMs,
    max: env.rateLimit.max,
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use(limiter);
}

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: { code: 'RATE_LIMITED', message: 'Too many auth attempts' } },
});

module.exports = { applySecurity, authLimiter };
