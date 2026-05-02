'use strict';

const path = require('path');
const Joi = require('joi');

require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

const envSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(3000),

  MONGO_URI: Joi.string().uri({ scheme: ['mongodb', 'mongodb+srv'] }).required(),

  JWT_ACCESS_SECRET: Joi.string().min(16).required(),
  JWT_REFRESH_SECRET: Joi.string().min(16).required(),
  JWT_ACCESS_EXPIRES_IN: Joi.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),

  BCRYPT_SALT_ROUNDS: Joi.number().integer().min(8).max(15).default(12),

  RATE_LIMIT_WINDOW_MS: Joi.number().default(15 * 60 * 1000),
  RATE_LIMIT_MAX: Joi.number().default(100),

  CLOUDINARY_CLOUD_NAME: Joi.string().allow('').default(''),
  CLOUDINARY_API_KEY: Joi.string().allow('').default(''),
  CLOUDINARY_API_SECRET: Joi.string().allow('').default(''),
  CLOUDINARY_UPLOAD_FOLDER: Joi.string().default('todo-list/tasks'),

  UPLOAD_MAX_FILE_SIZE_MB: Joi.number().integer().min(1).max(50).default(5),
}).unknown(true);

const { value: env, error } = envSchema.validate(process.env, { abortEarly: false });

if (error) {
  throw new Error(`Invalid environment configuration: ${error.message}`);
}

module.exports = Object.freeze({
  nodeEnv: env.NODE_ENV,
  port: env.PORT,
  isProd: env.NODE_ENV === 'production',
  mongo: { uri: env.MONGO_URI },
  jwt: {
    accessSecret: env.JWT_ACCESS_SECRET,
    refreshSecret: env.JWT_REFRESH_SECRET,
    accessExpiresIn: env.JWT_ACCESS_EXPIRES_IN,
    refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
  },
  bcrypt: { saltRounds: env.BCRYPT_SALT_ROUNDS },
  rateLimit: { windowMs: env.RATE_LIMIT_WINDOW_MS, max: env.RATE_LIMIT_MAX },
  cloudinary: {
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    apiKey: env.CLOUDINARY_API_KEY,
    apiSecret: env.CLOUDINARY_API_SECRET,
    folder: env.CLOUDINARY_UPLOAD_FOLDER,
  },
  upload: { maxFileSizeBytes: env.UPLOAD_MAX_FILE_SIZE_MB * 1024 * 1024 },
});
