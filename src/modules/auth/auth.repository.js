'use strict';

const User = require('./auth.model');

class AuthRepository {
  create(data) {
    return User.create(data);
  }

  findByPhone(phone, { withSecrets = false } = {}) {
    const query = User.findOne({ phone });
    if (withSecrets) query.select('+passwordHash +refreshTokenHash');
    return query.exec();
  }

  findById(id, { withSecrets = false } = {}) {
    const query = User.findById(id);
    if (withSecrets) query.select('+passwordHash +refreshTokenHash');
    return query.exec();
  }

  existsByPhone(phone) {
    return User.exists({ phone });
  }

  updateRefreshTokenHash(id, refreshTokenHash) {
    return User.findByIdAndUpdate(id, { refreshTokenHash }, { new: true }).exec();
  }
}

module.exports = new AuthRepository();
