const express = require('express');
const { authentication, authorization } = require('../../middleware/auth.middleware');
const log_apiController = require('../../modules/log_api/log_apiController');
const router = express.Router();

router.get('/',authentication, authorization, log_apiController.getAll);

module.exports = router;
