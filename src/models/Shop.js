const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isValidated: { type: Boolean, default: false }
});

module.exports = mongoose.model('Shop', shopSchema);
