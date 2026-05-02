'use strict';

const User = require('../auth/auth.model');

class ProfileRepository {
  findById(id) {
    return User.findById(id).exec();
  }

  updateById(id, patch) {
    return User.findByIdAndUpdate(id, patch, {
      new: true,
      runValidators: true,
      context: 'query',
    }).exec();
  }

  existsByPhoneExcludingId(phone, excludeId) {
    return User.exists({ phone, _id: { $ne: excludeId } });
  }
}

module.exports = new ProfileRepository();
