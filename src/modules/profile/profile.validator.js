'use strict';

const Joi = require('joi');
const { EXPERIENCE_LEVEL_VALUES } = require('../../constants/enums');
const { phoneSchema, addressSchema, objectIdSchema } = require('../../validators/common');

const updateMeSchema = {
  body: Joi.object({
    name: Joi.string().trim().min(2).max(80),
    phone: phoneSchema,
    experienceLevel: Joi.string().valid(...EXPERIENCE_LEVEL_VALUES),
    yearsOfExperience: Joi.number().integer().min(0).max(60),
    address: addressSchema,
  }).min(1),
};

const userIdParamSchema = {
  params: Joi.object({ id: objectIdSchema.required() }),
};

module.exports = { updateMeSchema, userIdParamSchema };
