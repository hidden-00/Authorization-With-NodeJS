const mongoose = require('mongoose');
const schema = mongoose.Schema;

const moduleSchema = new schema({
  module_name: { type: String, required: true },
  description: { type: String, required: true },
  is_deleted: { type: Boolean, default: false },
  route: { type: String, required: true },
  method: { type: String, require: true }
});

module.exports = Access = mongoose.model('moduleAccess', moduleSchema);
