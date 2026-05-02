'use strict';

const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { UnauthorizedError, RefreshFailedError } = require('../errors/httpErrors');

const TOKEN_TYPES = Object.freeze({ ACCESS: 'access', REFRESH: 'refresh' });

function signAccess(payload) {
  return jwt.sign({ ...payload, type: TOKEN_TYPES.ACCESS }, env.jwt.accessSecret, {
    expiresIn: env.jwt.accessExpiresIn,
  });
}

function signRefresh(payload) {
  return jwt.sign({ ...payload, type: TOKEN_TYPES.REFRESH }, env.jwt.refreshSecret, {
    expiresIn: env.jwt.refreshExpiresIn,
  });
}

function verifyAccess(token) {
  try {
    const decoded = jwt.verify(token, env.jwt.accessSecret);
    if (decoded.type !== TOKEN_TYPES.ACCESS) {
      throw new UnauthorizedError('Invalid token type', { code: 'TOKEN_INVALID' });
    }
    return decoded;
  } catch (err) {
    if (err instanceof UnauthorizedError) throw err;
    if (err.name === 'TokenExpiredError') {
      const e = new UnauthorizedError('Access token expired', { code: 'TOKEN_EXPIRED' });
      e.code = 'TOKEN_EXPIRED';
      throw e;
    }
    const e = new UnauthorizedError('Invalid access token', { code: 'TOKEN_INVALID' });
    e.code = 'TOKEN_INVALID';
    throw e;
  }
}

function verifyRefresh(token) {
  try {
    const decoded = jwt.verify(token, env.jwt.refreshSecret);
    if (decoded.type !== TOKEN_TYPES.REFRESH) {
      throw new RefreshFailedError('Invalid refresh token type');
    }
    return decoded;
  } catch (err) {
    if (err instanceof RefreshFailedError) throw err;
    if (err.name === 'TokenExpiredError') throw new RefreshFailedError('Refresh token expired');
    throw new RefreshFailedError('Invalid refresh token');
  }
}

module.exports = { signAccess, signRefresh, verifyAccess, verifyRefresh, TOKEN_TYPES };
