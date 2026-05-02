'use strict';

const repository = require('./profile.repository');
const { NotFoundError, ConflictError } = require('../../errors/httpErrors');

class ProfileService {
  async getById(id) {
    const user = await repository.findById(id);
    if (!user) throw new NotFoundError('User not found');
    return user.toJSON();
  }

  async updateById(id, patch) {
    if (patch.phone) {
      const conflict = await repository.existsByPhoneExcludingId(patch.phone, id);
      if (conflict) throw new ConflictError('Phone number already in use');
    }

    const user = await repository.updateById(id, patch);
    if (!user) throw new NotFoundError('User not found');
    return user.toJSON();
  }
}

module.exports = new ProfileService();
