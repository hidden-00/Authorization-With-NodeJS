const httpStatus = require('http-status');
const settingSchema = require('./settingSchema');
const sendResponse = require('../../helper/sendResponse');
const { getSetting } = require('../../helper/setting');

const settingController = {}

settingController.getAllSetting = async (req, res, next) => {
    try {
        const list_setting = await settingSchema.find();
        return sendResponse(res, httpStatus.OK, true, list_setting, null, 'Get all setting success!', null);
    } catch (err) {
        next(err);
    }
}

settingController.getSettingSingle = async (req, res, next) => {
    try {
        const settingId = req.params.setting_id;
        let setting = await settingSchema.findOne({ _id: settingId });
        return sendResponse(res, httpStatus.OK, true, setting, null, 'get Setting success', null);
    } catch (err) {
        next(err);
    }
}

settingController.getSettingType = async(req, res, next)=>{
    try{
        const settingType = req.params.type;
        let list_setting = await settingSchema.find({type: settingType});
        return sendResponse(res, httpStatus.OK, true, list_setting, null, 'get Setting type success', null);
    }catch(err){
        next(err);
    }
}

settingController.saveSetting = async(req, res, next)=>{
    try{
        let data = req.body;
        let saved;
        if(req.is_admin) data.admin = true;
        if(data._id){
            let id_user = req.user.id;
            data.updated_at = Date.now();
            data.updated_by = id_user;
            saved = await settingSchema.findOneAndUpdate({_id: data._id}, {$set:data}, {new: true});
        }else{
            let id_user = req.user.id;
            data.added_by = id_user;
            let newSetting = new settingSchema(data);
            saved = await newSetting.save();
        }
        return sendResponse(res, httpStatus.OK, true, saved, null, 'save setting success!', null);
    }catch(err){
        next(err);
    }
}

module.exports = settingController;
