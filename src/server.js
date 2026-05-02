'use strict';

const buildApp = require('./app');
const env = require('./config/env');
const db = require('./config/database');
const logger = require('./utils/logger');

async function start() {
  await db.connect();

  const app = buildApp();
  const server = app.listen(env.port, () => {
    logger.info(`Server listening on port ${env.port}`, { env: env.nodeEnv });
  });

  const shutdown = async (signal) => {
    logger.info(`Received ${signal}, shutting down`);
    server.close(async () => {
      await db.disconnect();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10_000).unref();
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled rejection', { reason: String(reason) });
  });
  process.on('uncaughtException', (err) => {
    logger.error('Uncaught exception', { message: err.message, stack: err.stack });
    process.exit(1);
  });
}

start().catch((err) => {
  logger.error('Failed to start server', { message: err.message, stack: err.stack });
  process.exit(1);
});
