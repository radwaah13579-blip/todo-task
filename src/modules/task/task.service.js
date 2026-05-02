'use strict';

const repository = require('./task.repository');
const cloudinary = require('../../integrations/cloudinary/cloudinary.service');
const { toCard, toDetails } = require('./task.mapper');
const {
  NotFoundError,
  ForbiddenError,
} = require('../../errors/httpErrors');

class TaskService {
  async create({ ownerId, data, file }) {
    let image = null;
    if (file) {
      image = await cloudinary.uploadBuffer(file.buffer);
    }

    try {
      const task = await repository.create({ ...data, owner: ownerId, image });
      return toDetails(task);
    } catch (err) {
      if (image) await cloudinary.destroy(image.publicId);
      throw err;
    }
  }

  async list({ page, limit, status, priority, sort }) {
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const result = await repository.paginate({ filter, page, limit, sort });
    return {
      items: result.items.map(toCard),
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    };
  }

  async getById(id) {
    const task = await repository.findById(id);
    if (!task) throw new NotFoundError('Task not found');
    return toDetails(task);
  }

  async update({ id, ownerId, patch, file }) {
    const task = await repository.findById(id);
    if (!task) throw new NotFoundError('Task not found');
    if (task.owner.toString() !== ownerId) {
      throw new ForbiddenError('You can only update your own tasks');
    }

    let nextImage = task.image;
    let oldPublicId = null;

    if (file) {
      const uploaded = await cloudinary.uploadBuffer(file.buffer);
      oldPublicId = task.image?.publicId || null;
      nextImage = uploaded;
    }

    try {
      const updated = await repository.updateById(id, { ...patch, image: nextImage });
      if (oldPublicId) await cloudinary.destroy(oldPublicId);
      return toDetails(updated);
    } catch (err) {
      if (file && nextImage?.publicId) await cloudinary.destroy(nextImage.publicId);
      throw err;
    }
  }

  async delete({ id, ownerId }) {
    const task = await repository.findById(id);
    if (!task) throw new NotFoundError('Task not found');
    if (task.owner.toString() !== ownerId) {
      throw new ForbiddenError('You can only delete your own tasks');
    }

    await repository.deleteById(id);
    if (task.image?.publicId) await cloudinary.destroy(task.image.publicId);
  }
}

module.exports = new TaskService();
