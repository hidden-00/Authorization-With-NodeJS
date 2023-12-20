const httpStatus = require("http-status");
const sendResponse = require("../../helper/sendResponse");
const log_apiSchema = require("./log_apiSchema");

const log_apiController = {}

log_apiController.getAll = async(req, res, next)=>{
    try{
        const list_log = await log_apiSchema.find();
        return sendResponse(res, httpStatus.OK, true, list_log, null, 'get log api success', null);
    }catch(err){
        next(err);
    }
}

module.exports = log_apiController;