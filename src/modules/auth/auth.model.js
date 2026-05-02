'use strict';

const mongoose = require('mongoose');
const { EXPERIENCE_LEVEL_VALUES, ROLE_VALUES, ROLES } = require('../../constants/enums');

const addressSchema = new mongoose.Schema(
  {
    city: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    phone: { type: String, required: true, unique: true, index: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    experienceLevel: {
      type: String,
      enum: EXPERIENCE_LEVEL_VALUES,
      required: true,
    },
    yearsOfExperience: { type: Number, min: 0, max: 60, default: 0 },
    address: { type: addressSchema, required: true },
    role: { type: String, enum: ROLE_VALUES, default: ROLES.USER },
    refreshTokenHash: { type: String, select: false, default: null },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.passwordHash;
        delete ret.refreshTokenHash;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model('User', userSchema);
