'use strict';

const levels = ['error', 'warn', 'info', 'debug'];

function log(level, message, meta) {
  const entry = {
    level,
    timestamp: new Date().toISOString(),
    message,
    ...(meta ? { meta } : {}),
  };
  const line = JSON.stringify(entry);
  if (level === 'error') process.stderr.write(line + '\n');
  else process.stdout.write(line + '\n');
}

const logger = {};
for (const level of levels) {
  logger[level] = (message, meta) => log(level, message, meta);
}

module.exports = logger;
