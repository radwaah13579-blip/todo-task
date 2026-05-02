'use strict';

const express = require('express');
const controller = require('./auth.controller');
const { signupSchema, loginSchema, refreshSchema } = require('./auth.validator');
const validate = require('../../middlewares/validate');
const authenticate = require('../../middlewares/authenticate');
const { authLimiter } = require('../../middlewares/security');

const router = express.Router();

router.post('/signup', authLimiter, validate(signupSchema), controller.signup);
router.post('/login', authLimiter, validate(loginSchema), controller.login);
router.post('/refresh', validate(refreshSchema), controller.refresh);
router.post('/logout', authenticate, controller.logout);

module.exports = router;
