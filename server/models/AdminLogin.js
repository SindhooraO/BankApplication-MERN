const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: true },
  name: { type: String, default: 'Admin' }, // Adding name field
});

module.exports = mongoose.model('AdminLogin', adminSchema);
