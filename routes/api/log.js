const express = require('express');
const {loginLogController} = require('../../modules/user/loginLog/loginLogController');
const { authentication, authorization } = require('../../middleware/auth.middleware');
const router = express.Router();

router.get('/',authentication, loginLogController.getLogList);
router.get('/all', authentication, authorization, loginLogController.getAllLog);

module.exports = router;
