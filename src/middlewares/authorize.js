'use strict';

const { ForbiddenError, UnauthorizedError } = require('../errors/httpErrors');

function authorize(...allowedRoles) {
  return (req, _res, next) => {
    if (!req.user) return next(new UnauthorizedError());
    if (allowedRoles.length === 0) return next();
    if (!allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError('Insufficient permissions'));
    }
    return next();
  };
}

module.exports = authorize;
