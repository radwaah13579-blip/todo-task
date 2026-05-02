'use strict';

const { StatusCodes } = require('http-status-codes');

class ApiResponse {
  static ok(res, data, message = 'OK') {
    return res.status(StatusCodes.OK).json({ success: true, message, data });
  }

  static created(res, data, message = 'Created') {
    return res.status(StatusCodes.CREATED).json({ success: true, message, data });
  }

  static noContent(res) {
    return res.status(StatusCodes.NO_CONTENT).send();
  }
}

module.exports = ApiResponse;
