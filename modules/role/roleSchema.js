const mongoose = require('mongoose');
const schema = mongoose.Schema;

const rolesSchema = new schema({
  role_title: { type: String, required: true, unique: true},
  description: { type: String,required: true, unique: true },
  access_rights: [{ type: schema.Types.ObjectId, required: true, ref: "moduleAccess" }],
  is_deleted: {type: Boolean, default: false}
});

module.exports = Roles = mongoose.model('roles', rolesSchema);
