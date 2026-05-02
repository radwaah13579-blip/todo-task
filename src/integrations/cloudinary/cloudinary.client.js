'use strict';

const { v2: cloudinary } = require('cloudinary');
const env = require('../../config/env');

let configured = false;

function getClient() {
  if (!configured) {
    cloudinary.config({
      cloud_name: env.cloudinary.cloudName,
      api_key: env.cloudinary.apiKey,
      api_secret: env.cloudinary.apiSecret,
      secure: true,
    });
    configured = true;
  }
  return cloudinary;
}

module.exports = { getClient };
