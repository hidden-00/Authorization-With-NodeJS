const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userSchema = new schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  updated_at: { type: Date },
  added_at: { type: Date, default: Date.now, required: true },
  added_by: { type: schema.Types.ObjectId, ref: "users" },
  is_active: { type: Boolean, required: true, default: true },
  is_added_by_admin: { type: Boolean, required: true, default: false },
  roles: [{ type: schema.Types.ObjectId, required: true, ref: "roles" }],
  is_deleted: {
    type: Boolean,
    default: false,
    required: true,
  },
  deleted_by: {
    type: schema.Types.ObjectId,
  },
  deleted_at: {
    type: Date,
  },
});

module.exports = User = mongoose.model("users", userSchema);
