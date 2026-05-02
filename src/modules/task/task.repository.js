'use strict';

const Task = require('./task.model');

class TaskRepository {
  create(data) {
    return Task.create(data);
  }

  findById(id) {
    return Task.findById(id).exec();
  }

  findByIdAndOwner(id, ownerId) {
    return Task.findOne({ _id: id, owner: ownerId }).exec();
  }

  updateById(id, patch) {
    return Task.findByIdAndUpdate(id, patch, {
      new: true,
      runValidators: true,
      context: 'query',
    }).exec();
  }

  deleteById(id) {
    return Task.findByIdAndDelete(id).exec();
  }

  async paginate({ filter = {}, page = 1, limit = 10, sort = '-createdAt' }) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Task.find(filter).sort(sort).skip(skip).limit(limit).lean({ virtuals: true }).exec(),
      Task.countDocuments(filter).exec(),
    ]);
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) || 1 };
  }
}

module.exports = new TaskRepository();
