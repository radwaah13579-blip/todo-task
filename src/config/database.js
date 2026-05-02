'use strict';

const mongoose = require('mongoose');
const env = require('./env');
const logger = require('../utils/logger');

mongoose.set('strictQuery', true);

async function connect() {
  await mongoose.connect(env.mongo.uri, { autoIndex: !env.isProd });
  logger.info('MongoDB connected');
}

async function disconnect() {
  await mongoose.disconnect();
  logger.info('MongoDB disconnected');
}

module.exports = { connect, disconnect };
