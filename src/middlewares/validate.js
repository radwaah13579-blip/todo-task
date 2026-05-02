'use strict';

const { ValidationError } = require('../errors/httpErrors');

const SOURCES = ['body', 'query', 'params'];

function validate(schemas) {
  return (req, _res, next) => {
    const details = [];

    for (const source of SOURCES) {
      const schema = schemas[source];
      if (!schema) continue;

      const { value, error } = schema.validate(req[source], {
        abortEarly: false,
        stripUnknown: true,
        convert: true,
      });

      if (error) {
        for (const d of error.details) {
          details.push({ source, path: d.path.join('.'), message: d.message });
        }
        continue;
      }

      req[source] = value;
    }

    if (details.length > 0) return next(new ValidationError('Invalid request payload', details));
    return next();
  };
}

module.exports = validate;
