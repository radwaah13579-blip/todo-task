'use strict';

const express = require('express');
const { applySecurity } = require('./middlewares/security');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');
const routes = require('./routes');

function buildApp() {
  const app = express();

  applySecurity(app);
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));

  app.use('/api/v1', routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = buildApp;
