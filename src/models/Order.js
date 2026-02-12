const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  items: [{
    produit: { type: mongoose.Schema.Types.ObjectId, ref: 'Produit' },
    quantite: { type: Number, default: 1 },
    prix: { type: Number, required: true }
  }],
  totalPrix: { type: Number, required: true },
  status: { type: String, enum: ['pending','confirmé','livré'], default: 'pending' },
  dateCreation: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
