const express = require('express');
const router = express.Router();

// All route of User
const userRoutes = require('./api/user');
router.use('/user', userRoutes);

// All route of Role
const roleRoutes = require('./api/role');
router.use('/role', roleRoutes);

//All route of Module
const moduleRoutes = require('./api/module');
router.use('/module', moduleRoutes);

//All route of Setting
const settingRoutes = require('./api/setting');
router.use('/setting', settingRoutes);

//All route of LoginLog
const logRoutes = require('./api/log');
router.use('/log', logRoutes);

//All route of API log
const logApiRoutes = require('./api/log_api');
router.use('/log_api', logApiRoutes);

module.exports = router;
