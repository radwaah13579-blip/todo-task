'use strict';

const multer = require('multer');
const env = require('../config/env');
const { BadRequestError } = require('../errors/httpErrors');

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

function fileFilter(_req, file, cb) {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    return cb(new BadRequestError('Only JPEG, PNG, WEBP and GIF images are allowed'));
  }
  cb(null, true);
}

const baseUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.upload.maxFileSizeBytes, files: 1 },
  fileFilter,
});

function singleImage(fieldName = 'image') {
  const handler = baseUpload.single(fieldName);
  return (req, res, next) => {
    handler(req, res, (err) => {
      if (!err) return next();
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new BadRequestError('Image exceeds maximum allowed size'));
        }
        return next(new BadRequestError(err.message));
      }
      next(err);
    });
  };
}

module.exports = { singleImage };
