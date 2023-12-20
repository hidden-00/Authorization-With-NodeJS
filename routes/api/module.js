const express = require('express');
const roleController = require('../../modules/role/roleController');
const { authentication, authorization } = require('../../middleware/auth.middleware');
const router = express.Router();

router.get('/',authentication, authorization, roleController.getAllModule);
router.post('/',authentication, authorization, roleController.saveModule);

module.exports = router;
