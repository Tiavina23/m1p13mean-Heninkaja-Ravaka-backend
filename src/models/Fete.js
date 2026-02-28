const mongoose = require('mongoose');

const feteSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  date: { type: Date, required: true }
});

module.exports = mongoose.model('Fete', feteSchema);