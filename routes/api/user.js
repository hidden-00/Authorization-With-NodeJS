const express = require('express');
const userController = require('../../modules/user/userController');
const { authentication, authorization, getClientInfo, authenticationForLogout } = require('../../middleware/auth.middleware');
const { loginLogController } = require('../../modules/user/loginLog/loginLogController');
const router = express.Router();

//Done
router.get("/",authentication, authorization, userController.getAll);
//Done
router.get("/logout", authenticationForLogout, loginLogController.logout);
//Done
router.get("/get_me", authentication, userController.get_me);
//Done
router.get("/:id",authentication, authorization, userController.getOneById);
router.post("/register", userController.createUser);
//Done
router.post("/login", getClientInfo ,userController.login);
router.post("/grant_multi_roles", authentication, authorization, userController.grantMultiRole);

router.post("/removeToken", authentication, authorization, loginLogController.removeToken);

module.exports = router;
