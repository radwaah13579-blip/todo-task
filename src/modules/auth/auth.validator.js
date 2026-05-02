'use strict';

const Joi = require('joi');
const { EXPERIENCE_LEVEL_VALUES } = require('../../constants/enums');
const {
  phoneSchema,
  passwordSchema,
  addressSchema,
} = require('../../validators/common');

const signupSchema = {
  body: Joi.object({
    name: Joi.string().trim().min(2).max(80).required(),
    phone: phoneSchema.required(),
    password: passwordSchema.required(),
    experienceLevel: Joi.string().valid(...EXPERIENCE_LEVEL_VALUES).required(),
    yearsOfExperience: Joi.number().integer().min(0).max(60).default(0),
    address: addressSchema.required(),
  }),
};

const loginSchema = {
  body: Joi.object({
    phone: phoneSchema.required(),
    password: Joi.string().required(),
  }),
};

const refreshSchema = {
  body: Joi.object({
    refreshToken: Joi.string().required(),
  }),
};

module.exports = { signupSchema, loginSchema, refreshSchema };
