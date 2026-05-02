'use strict';

const Joi = require('joi');
const { normalizePhone } = require('../utils/phone');

const phoneSchema = Joi.string()
  .trim()
  .custom((value, helpers) => {
    const result = normalizePhone(value);
    if (!result) return helpers.error('phone.invalid');
    return result.e164;
  }, 'phone normalization')
  .messages({
    'phone.invalid': 'Phone number is invalid or missing country code (e.g. +201234567890)',
  });

const passwordSchema = Joi.string()
  .min(8)
  .max(128)
  .pattern(/[a-z]/, 'lowercase')
  .pattern(/[A-Z]/, 'uppercase')
  .pattern(/[0-9]/, 'digit')
  .messages({
    'string.pattern.name': 'Password must contain at least one {#name} character',
    'string.min': 'Password must be at least {#limit} characters',
  });

const objectIdSchema = Joi.string()
  .pattern(/^[a-f\d]{24}$/i)
  .messages({ 'string.pattern.base': 'Invalid id format' });

const addressSchema = Joi.object({
  city: Joi.string().trim().min(2).max(80).required(),
  country: Joi.string().trim().min(2).max(80).required(),
});

module.exports = { phoneSchema, passwordSchema, objectIdSchema, addressSchema };
