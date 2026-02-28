const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['true', 'false'],
    default: 'false'
  }
}, { timestamps: true });

module.exports = mongoose.model('Shop', shopSchema);