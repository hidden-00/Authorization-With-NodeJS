const express = require('express');
const settingController = require('../../modules/setting/settingController');
const { authentication, authorization } = require('../../middleware/auth.middleware');
const router = express.Router();

router.get('/',authentication, authorization, settingController.getAllSetting);
router.get('/:id',authentication, authorization, settingController.getSettingSingle);
router.get('/type/:id',authentication, authorization, settingController.getSettingType);
router.post('/',authentication, authorization, settingController.saveSetting);

module.exports = router;
