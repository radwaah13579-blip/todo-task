'use strict';

const crypto = require('crypto');
const repository = require('./auth.repository');
const password = require('../../utils/password');
const tokens = require('../../utils/jwt');
const {
  ConflictError,
  UnauthorizedError,
  RefreshFailedError,
} = require('../../errors/httpErrors');

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

async function issueTokens(user) {
  const payload = { sub: user.id, role: user.role };
  const accessToken = tokens.signAccess(payload);
  const refreshToken = tokens.signRefresh(payload);
  await repository.updateRefreshTokenHash(user.id, hashToken(refreshToken));
  return { accessToken, refreshToken };
}

class AuthService {
  async signup(input) {
    const exists = await repository.existsByPhone(input.phone);
    if (exists) throw new ConflictError('Phone number already registered');

    const passwordHash = await password.hash(input.password);

    const user = await repository.create({
      name: input.name,
      phone: input.phone,
      passwordHash,
      experienceLevel: input.experienceLevel,
      yearsOfExperience: input.yearsOfExperience,
      address: input.address,
    });

    const tokenPair = await issueTokens(user);
    return { user: user.toJSON(), ...tokenPair };
  }

  async login({ phone, password: plainPassword }) {
    const user = await repository.findByPhone(phone, { withSecrets: true });
    if (!user) throw new UnauthorizedError('Invalid phone or password');

    const ok = await password.compare(plainPassword, user.passwordHash);
    if (!ok) throw new UnauthorizedError('Invalid phone or password');

    const tokenPair = await issueTokens(user);
    return { user: user.toJSON(), ...tokenPair };
  }

  async refresh(refreshToken) {
    const decoded = tokens.verifyRefresh(refreshToken);
    const user = await repository.findById(decoded.sub, { withSecrets: true });
    if (!user || !user.refreshTokenHash) throw new RefreshFailedError('Session expired');

    if (user.refreshTokenHash !== hashToken(refreshToken)) {
      await repository.updateRefreshTokenHash(user.id, null);
      throw new RefreshFailedError('Refresh token reuse detected');
    }

    return issueTokens(user);
  }

  async logout(userId) {
    await repository.updateRefreshTokenHash(userId, null);
  }
}

module.exports = new AuthService();
