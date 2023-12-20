'use strict'
const logMiddleware = {}
const log_apiSchema = require('../modules/log_api/log_apiSchema');

logMiddleware.saveLog = async(req, res, next)=>{
    try{
        const startTime = Date.now();
        await res.on('finish', async()=>{
            const endTime = Date.now();
            let new_log;
            if(!req.user){
                new_log = new log_apiSchema({url: req.baseUrl+ req.url, method: req.method, status: res.statusCode, time_start: startTime, time_end: endTime})
            }
            else{
                new_log = new log_apiSchema({url: req.baseUrl+ req.url, method: req.method, status: res.statusCode, time_start: startTime, time_end: endTime, user_id: req.user._id});
                // console.log(new_log)
            }
            const save_log = await new_log.save();
        })
        next();
    }catch(err){
        next(err);
    }
}

module.exports = logMiddleware;