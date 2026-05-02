'use strict';

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');
const env = require('../config/env');

function applySecurity(app) {
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors());
  app.use(mongoSanitize());

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
