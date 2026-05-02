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

const addressObjectSchema = Joi.object({
  city: Joi.string().trim().min(2).max(80).required(),
  country: Joi.string().trim().min(2).max(80).required(),
});

const addressSchema = Joi.alternatives()
  .try(
    addressObjectSchema,
    Joi.string()
      .trim()
      .pattern(/^[^,]{2,80},[^,]{2,80}$/)
      .custom((value) => {
        const [city, country] = value.split(',').map((s) => s.trim());
        return { city, country };
      }, 'address string to object')
      .messages({
        'string.pattern.base': 'Address must be in the format "city,country"',
      })
  )
  .messages({
    'alternatives.match': 'Address must be either an object with city and country, or the string "city,country"',
  });

module.exports = { phoneSchema, passwordSchema, objectIdSchema, addressSchema };
