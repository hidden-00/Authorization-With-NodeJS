'use strict';
const jwt = require('jsonwebtoken');
const sendResponse = require('../helper/sendResponse');
const httpStatus = require('http-status');
const loginLogSchema = require('../modules/user/loginLog/loginLogSchema');
const roleSchema = require('../modules/role/roleSchema');
const isEmpty = require('../validation/isEmpty');
const useragent = require('useragent')
const requestIp = require('request-ip');
const moduleSchema = require('../modules/role/moduleSchema');
const { getSetting } = require('../helper/setting');
const authMiddleware = {};

authMiddleware.authentication = async (req, res, next) => {
    try {
        const secretOrKey = await getSetting('auth', 'token', 'secret_key');
        let token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.authorization || req.headers.token;
        if (token && token.length) {
            token = token.replace('Bearer ', '');
            const d = await jwt.verify(token, secretOrKey);
            req.user = d;
            let passed = await loginLogSchema.findOne({ token, is_active: true });
            if (passed) {
                return next();
            }
            return sendResponse(res, httpStatus.UNAUTHORIZED, false, null, null, 'Session Expired', null);
        }
        return sendResponse(res, httpStatus.UNAUTHORIZED, false, null, token, 'token not found', null);
    } catch (err) {
        next(err);
    }
}

authMiddleware.authenticationForLogout = async (req, res, next) => {
    try {
        const secretOrKey = await getSetting('auth', 'token', 'secret_key');
        let token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.authorization || req.headers.token;
        if (token && token.length) {
            token = token.replace('Bearer ', '');
            const d = await jwt.verify(token, secretOrKey);
            req.user = d;
            return next();
        }
        return otherHelper.sendResponse(res, httpStatus.UNAUTHORIZED, false, null, token, 'token not found', null);
    } catch (err) {
        return next(err);
    }
};

authMiddleware.authorization = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return sendResponse(res, httpStatus.UNAUTHORIZED, false, null, null, 'User Information Not found', null);
        }
        const roles = await roleSchema.find({ _id: { $in: user.roles } }, { _id: 1, access_rights: 1});
        let path = req.baseUrl + req.route.path;
        if (path.substr(path.length - 1) === '/') {
            path = path.slice(0, path.length - 1);
        }
        if (isEmpty(roles)) return sendResponse(res, httpStatus.UNAUTHORIZED, false, null, null, 'Can not any role', null);
        const id_supper_admin = await getSetting('auth','id','admin');
        const isAdmin = roles.find((e) => e._id.toString() === id_supper_admin);
        if (isAdmin){
            req.is_admin = true;
            return next();
        }
        req.is_admin = false;
        const method = req.method;
        let listAccess = [];
        for(let role of roles){
            listAccess.push(...role.access_rights);
        }
        if (isEmpty(listAccess)) return sendResponse(res, httpStatus.UNAUTHORIZED, false, null, null, 'No module access in role', null);
        const get_module_from_path_and_method = await moduleSchema.findOne({ route: path, $or: [{method: method},{method: method.toLowerCase()}] });
        if (!get_module_from_path_and_method) return sendResponse(res, httpStatus.UNAUTHORIZED, false, null, null, 'Unauthorized', null);
        const passed = listAccess.find((e) => e.toString() === get_module_from_path_and_method._id.toString());
        if (passed) return next();
        return sendResponse(res, httpStatus.UNAUTHORIZED, false, null, null, 'Unauthorized', null);
    } catch (err) {
        next(err);
    }
}

authMiddleware.getClientInfo = async (req, res, next) => {
    let info = {};
    let agent = useragent.parse(req.headers['user-agent']);
    info.browser = agent.toAgent().toString();
    info.device = agent.os.toString();

    info.ip = requestIp.getClientIp(req);
    req.client_info = info;
    return next();
}

module.exports = authMiddleware;
