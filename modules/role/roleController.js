const httpStatus = require("http-status");
const sendResponse = require("../../helper/sendResponse");
const roleSchema = require("./roleSchema");
const moduleSchema = require("./moduleSchema");

const roleController = {};

//Done
roleController.getAll = async (req, res, next) => {
    try {
        const list_role = await roleSchema.find().populate('access_rights');
        if (list_role.length === 0)
            return sendResponse(res, httpStatus.OK, true, null, null, 'No Role', null);
        return sendResponse(res, httpStatus.OK, true, list_role, null, 'Get all role success!', null);
    } catch (err) {
        next(err);
    }
}

//Done
roleController.getOneById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const role = await roleSchema.findById(id).populate('access_rights');
        if (!role) return sendResponse(res, httpStatus.NOT_FOUND, false, null, null, 'Not found role', null);
        return sendResponse(res, httpStatus.OK, true, role, null, 'Get role success!', null);
    } catch (err) {
        next(err);
    }
}

//Done
roleController.postRole = async (req, res, next) => {
    try {
        let errors = {};
        const role = req.body;
        if (!role.role_title || !role.description) {
            errors.field = "not enough data fields";
            return sendResponse(res, httpStatus.BAD_REQUEST, false, null, errors, errors.field, null);
        }
        let saveRole;
        if (!role._id) {
            const newRole = new roleSchema(role);
            saveRole = await newRole.save();
        }else saveRole = await roleSchema.findOneAndUpdate({_id: role._id}, { $set: role }, { new: true });
        return sendResponse(res, httpStatus.OK, true, saveRole, null, 'role save success!', null);
    } catch (err) {
        next(err);
    }
}

roleController.deleteRole = async(req, res, next)=>{
    try{
        const id = req.body.id;
        const role_updated = await roleSchema.findOneAndUpdate({_id: id}, {$set: {is_deleted: true}}, {new: true});
        return sendResponse(res, httpStatus.OK, true, role_updated, null, 'role delete success', null);
    }catch(err){
        next(err);
    }
}

roleController.grantMultiModules = async (req, res, next) => {
    try {
        let errors = {};
        const { access_ids, role_id } = req.body;
        const modules = await moduleSchema.find({ _id: { $in: access_ids } });
        const role = await roleSchema.findById(role_id);
        if (!role) {
            errors.not_found = 'cannot find role';
            return sendResponse(res, httpStatus.BAD_REQUEST, false, null, errors, errors.not_found, null);
        }
        role.access_rights = modules.map(e => e._id);
        const saveRole = await role.save();
        return sendResponse(res, httpStatus.OK, true, saveRole, null, 'role save success!', null);
    } catch (err) {
        next(err);
    }
}

roleController.saveModule = async (req, res, next) => {
    try {
        let data = req.body;
        let saved;
        if(data._id){
            saved = await moduleSchema.findOneAndUpdate({_id: data._id}, {$set:data}, {new: true});
        }else{
            let newModuleAccess = new moduleSchema(data);
            saved = await newModuleAccess.save();
        }
        return sendResponse(res, httpStatus.OK, true, saved, null, 'save module success!', null);
    } catch (err) {
        next(err);
    }
}

roleController.getAllModule = async (req, res, next) => {
    try {
        const list_module = await moduleSchema.find();
        if (list_module.length === 0)
            return sendResponse(res, httpStatus.OK, true, null, null, 'No module', null);
        return sendResponse(res, httpStatus.OK, true, list_module, null, 'Get all module success!', null);
    } catch (err) {
        next(err);
    }
}

module.exports = roleController;
