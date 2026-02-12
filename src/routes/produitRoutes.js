const express = require('express');
const router = express.Router();
const Produit = require('../models/Produit');

// insertion
router.post('/', async (req, res) => {
  const p = new Produit(req.body);
  await p.save();
  res.status(201).json(p);
});

// select all
router.get('/', async (req, res) => {
  const produits = await Produit.find().populate('categorie shop');
  res.json(produits);
});

// select one
router.get('/:id', async (req, res) => {
  const p = await Produit.findById(req.params.id).populate('categorie shop');
  res.json(p);
});

// modification
router.put('/:id', async (req, res) => {
  const p = await Produit.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(p);
});

// suppression
router.delete('/:id', async (req, res) => {
  await Produit.findByIdAndDelete(req.params.id);
  res.json({ message: 'Produit supprimé' });
});

module.exports = router;
