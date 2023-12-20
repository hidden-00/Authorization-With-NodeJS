const mongoose = require('mongoose');
const schema = mongoose.Schema;

const log_apiSchema = new schema({
    url:{type: String},
    method:{type: String},
    status: {type: String},
    time_start:{type: Date},
    time_end:{type: Date},
    user_id: {type: mongoose.Types.ObjectId}
})

module.exports = log_api = mongoose.model('log_api', log_apiSchema);