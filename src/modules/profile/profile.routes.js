'use strict';

const express = require('express');
const controller = require('./profile.controller');
const { updateMeSchema, userIdParamSchema } = require('./profile.validator');
const validate = require('../../middlewares/validate');
const authenticate = require('../../middlewares/authenticate');
const authorize = require('../../middlewares/authorize');
const { ROLES } = require('../../constants/enums');

const router = express.Router();

router.use(authenticate);

router.get('/me', controller.getMe);
router.patch('/me', validate(updateMeSchema), controller.updateMe);

router.get('/:id', authorize(ROLES.ADMIN), validate(userIdParamSchema), controller.getById);

module.exports = router;
