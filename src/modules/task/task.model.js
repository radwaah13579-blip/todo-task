'use strict';

const mongoose = require('mongoose');
const {
  TASK_STATUS_VALUES,
  TASK_STATUS,
  TASK_PRIORITY_VALUES,
} = require('../../constants/enums');

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { _id: false }
);

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
    description: { type: String, required: true, trim: true, minlength: 2, maxlength: 2000 },
    priority: { type: String, enum: TASK_PRIORITY_VALUES, required: true },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: TASK_STATUS_VALUES, default: TASK_STATUS.WAITING, index: true },
    image: { type: imageSchema, default: null },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model('Task', taskSchema);
