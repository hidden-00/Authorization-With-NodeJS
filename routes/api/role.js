const express = require('express');
const roleController = require('../../modules/role/roleController');
const { authorization, authentication } = require('../../middleware/auth.middleware');
const router = express.Router();

//Done
router.get('/',authentication, roleController.getAll);
//Done
router.post('/', roleController.postRole);

router.post('/grant_access', authentication, authorization, roleController.grantMultiModules);

router.post('/delete', authentication, authorization, roleController.deleteRole);

//Done
router.get('/:id',authentication, authorization, roleController.getOneById);

module.exports = router;
