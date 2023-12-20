const bcrypt = require('bcryptjs');
const userSchema = require('./userSchema');
const roleSchema = require('../role/roleSchema');
const sendResponse = require('../../helper/sendResponse');
const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const { getSetting } = require('../../helper/setting');
const loginLogs = require('./loginLog/loginLogController').internal;
const userController = {};

userController.get_me = async (req, res, next) => {
    try {
        const user = await userSchema.findOne({ _id: req.user._id }, { email: 1, _id: 1, name: 1, roles: 1 }).populate('roles');
        return sendResponse(res, httpStatus.OK, true, user, null, "get me success", null);
    } catch (err) {
        next(err);
    }
}

userController.createUser = async (req, res, next) => {
    try {
        let errors = {};
        let { name, email, password } = req.body;
        if (!name || !email || !password) {
            errors.field = "not enough data fields";
            return sendResponse(res, httpStatus.BAD_REQUEST, false, null, errors, errors.field, null);
        }
        let salt = await bcrypt.genSalt(10);
        let hashPwd = await bcrypt.hash(password, salt);
        const newUser = new userSchema({ name, email, password: hashPwd });
        const userSave = await newUser.save();
        const secretOrKey = await getSetting('auth', 'token', 'secret_key');
        var tokenExpireTime = await getSetting('auth', 'token', 'expiry_time');
        tokenExpireTime = Number.parseInt(tokenExpireTime);
        const payload = {
            _id: userSave._id,
            email: userSave.email,
            name: userSave.name,
            roles: userSave.roles
        }
        let token = await jwt.sign(payload, secretOrKey, {
            expiresIn: tokenExpireTime,
        })
        loginLogs.addloginlog(req, token, next);
        token = `Bearer ${token}`
        return sendResponse(res, httpStatus.OK, true, payload, null, null, token);

    } catch (err) {
        next(err)
    }
}

userController.grantMultiRole = async (req, res, next) => {
    try {
        let errors = {};
        const { user_id, role_ids } = req.body;
        const user = await userSchema.findById(user_id);
        const roles = await roleSchema.find({ _id: { $in: role_ids } });
        if (!user) {
            errors.not_found = 'cannot found user';
            return sendResponse(res, httpStatus.BAD_REQUEST, false, null, errors, errors.not_found, null);
        }
        user.roles = roles.map((e) => e._id);
        const saveUser = await user.save();
        return sendResponse(res, httpStatus.OK, true, saveUser, null, 'grant role success!', null);
    } catch (err) {
        next(err);
    }
}

//Done
userController.getAll = async (req, res, next) => {
    try {
        const list_user = await userSchema.find({}, { password: 0 }).populate('roles', 'role_title');
        return sendResponse(res, httpStatus.OK, true, list_user, null, 'Get all user success!', null);
    } catch (err) {
        next(err)
    }
}

//Done
userController.getOneById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = await userSchema.findById(id).populate('roles');
        if (!user) return sendResponse(res, httpStatus.NOT_FOUND, false, null, null, 'Not found user', null);
        return sendResponse(res, httpStatus.OK, true, user, null, 'Get user success!', null);
    } catch (err) {
        next(err)
    }
}

//Done
userController.login = async (req, res, next) => {
    try {
        let errors = {};
        const { email, password } = req.body;
        const user = await userSchema.findOne({ email: email.toLowerCase() }).populate('roles');
        if (!user) {
            errors.email = 'Email not found';
            return sendResponse(res, httpStatus.NOT_FOUND, false, null, errors, errors.email, null);
        } else {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                const secretOrKey = await getSetting('auth', 'token', 'secret_key');
                var tokenExpireTime = await getSetting('auth', 'token', 'expiry_time');
                tokenExpireTime = Number.parseInt(tokenExpireTime);
                const payload = {
                    _id: user._id,
                    email: user.email,
                    name: user.name,
                    roles: user.roles
                }
                let token = await jwt.sign(payload, secretOrKey, {
                    expiresIn: tokenExpireTime,
                })
                await user.save();
                loginLogs.addloginlog(req, token, next);
                token = `Bearer ${token}`
                return sendResponse(res, httpStatus.OK, true, payload, null, null, token);
            } else {
                errors.password = 'Password incorrect';
                return sendResponse(res, httpStatus.BAD_REQUEST, false, null, errors, errors.password, null);
            }
        }
    } catch (err) {
        next(err);
    }
}

module.exports = userController;
