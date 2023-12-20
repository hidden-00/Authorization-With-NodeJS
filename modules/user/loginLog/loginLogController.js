const jwt = require('jsonwebtoken');
const loginLogSchema = require('./loginLogSchema');
const sendResponse = require('../../../helper/sendResponse');
const httpStatus = require('http-status');
const { getSetting } = require('../../../helper/setting');

const internal = {};
const loginLogController = {};

internal.addloginlog = async(req, token, next)=>{
	try{
		const secretOrKey = await getSetting('auth','token','secret_key') || "Mike22-11";
		let jwtpayload = await jwt.verify(token, secretOrKey);
		let expires_in = new Date(jwtpayload.exp * 1000);
		let user_id = jwtpayload._id;
		const newLog = new loginLogSchema({user_id, expires_in, ip_address: req.client_info.ip, device_info: req.client_info.device, browser_info: req.client_info.browser, token});
		return newLog.save();
	}catch(err){
		next(err);
	}
}

loginLogController.getLogList = async (req, res, next) => {
  let user_id = req.user._id;
  try {
  	const list_logs = await loginLogSchema.find({user_id}).populate({
      path:"user_id",
      select: ['email', 'name']
    });
  	return sendResponse(res, httpStatus.OK, true, list_logs, null, 'get data success!', null);
  } catch (err) {
    next(err);
  }
};

loginLogController.getAllLog = async (req, res, next) => {
  try {
  	const list_logs = await loginLogSchema.find().populate({
      path:"user_id",
      select: ['email', 'name']
    });
  	return sendResponse(res, httpStatus.OK, true, list_logs, null, 'get data success!', null);
  } catch (err) {
    next(err);
  }
};

loginLogController.logout = async (req, res, next) => {
  try {
    let token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.authorization || req.headers.token;
    token = token.replace('Bearer ', '');
    let inactiveLog = await loginLogSchema.findOneAndUpdate({ token }, { $set: { is_active: false, logout_date: Date.now() } });
    if (inactiveLog) {
      return sendResponse(res, httpStatus.OK, true, null, null, 'Logged out', null);
    } else {
      return sendResponse(res, httpStatus.OK, false, null, null, 'Logged out', null);
    }
  } catch (err) {
    next(err);
  }
};

loginLogController.removeToken = async (req, res, next) => {
  let { loginID } = req.body;
  let found;
  try {
    found = await loginLogSchema.findOneAndUpdate({ _id: loginID, user_id: req.user.id }, { $set: { is_active: false, logout_date: Date.now() } }, { new: true }).select('login_date logout_date ip_address device_info browser_info is_active');
  } catch (err) {
    next(err);
  }
  if (found) {
    return sendResponse(res, httpStatus.OK, true, found, null, 'Logged out', null);
  } else {
    return sendResponse(res, httpStatus.BAD_REQUEST, false, null, null, 'Invalid Data', null);
  }
};

module.exports = {internal, loginLogController};