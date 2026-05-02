'use strict';

const streamifier = require('streamifier');
const { getClient } = require('./cloudinary.client');
const env = require('../../config/env');
const AppError = require('../../errors/AppError');
const logger = require('../../utils/logger');

class CloudinaryService {
  uploadBuffer(buffer, { folder, resourceType = 'image', publicId } = {}) {
    return new Promise((resolve, reject) => {
      const stream = getClient().uploader.upload_stream(
        {
          folder: folder || env.cloudinary.folder,
          resource_type: resourceType,
          public_id: publicId,
          overwrite: true,
        },
        (error, result) => {
          if (error) return reject(new AppError('Image upload failed', 502, 'UPLOAD_FAILED'));
          resolve({ url: result.secure_url, publicId: result.public_id });
        }
      );
      streamifier.createReadStream(buffer).pipe(stream);
    });
  }

  async destroy(publicId) {
    if (!publicId) return;
    try {
      await getClient().uploader.destroy(publicId, { invalidate: true });
    } catch (err) {
      logger.warn('Cloudinary destroy failed', { publicId, message: err.message });
    }
  }
}

module.exports = new CloudinaryService();
