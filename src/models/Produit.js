const mongoose = require('mongoose');

const produitSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  prix: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  image: { type: String },
  categorie: { type: mongoose.Schema.Types.ObjectId, ref: 'Categorie' },
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
  dateCreation: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Produit', produitSchema);
