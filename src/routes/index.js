'use strict';

const express = require('express');
const authRoutes = require('../modules/auth/auth.routes');
const profileRoutes = require('../modules/profile/profile.routes');
const taskRoutes = require('../modules/task/task.routes');

const router = express.Router();

router.get('/health', (_req, res) => res.json({ success: true, data: { status: 'ok' } }));

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/tasks', taskRoutes);

module.exports = router;
