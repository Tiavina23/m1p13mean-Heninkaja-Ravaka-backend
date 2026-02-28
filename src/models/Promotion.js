const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  produits: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Produit', required: true }],
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  tauxReduction: { type: Number, required: true },
  dateDebut: { type: Date, required: true },
  dateFin: { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Promotion', promotionSchema);