'use strict';

const { verifyAccess } = require('../utils/jwt');
const { UnauthorizedError } = require('../errors/httpErrors');
const asyncHandler = require('../utils/asyncHandler');
const userRepository = require('../modules/auth/auth.repository');

function extractToken(req) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return null;
  return header.slice('Bearer '.length).trim();
}

const authenticate = asyncHandler(async (req, _res, next) => {
  const token = extractToken(req);
  if (!token) {
    const err = new UnauthorizedError('Authentication token missing');
    err.code = 'TOKEN_MISSING';
    throw err;
  }

  const decoded = verifyAccess(token);

  const user = await userRepository.findById(decoded.sub);
  if (!user) {
    const err = new UnauthorizedError('User no longer exists');
    err.code = 'TOKEN_INVALID';
    throw err;
  }

  req.user = {
    id: user.id,
    phone: user.phone,
    experienceLevel: user.experienceLevel,
    role: user.role,
  };

  next();
});

module.exports = authenticate;
