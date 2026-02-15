const express = require('express');
const router = express.Router();
const Categorie = require('../models/Categorie');

// insertion
router.post('/', async (req, res) => {
  const cat = new Categorie(req.body);
  await cat.save();
  res.status(201).json(cat);
});

// select all
router.get('/', async (req, res) => {
  const cats = await Categorie.find();
  res.json(cats);
});

// select one
router.get('/:id', async (req, res) => {
  const cat = await Categorie.findById(req.params.id);
  res.json(cat);
});

// modification
router.put('/:id', async (req, res) => {
  const cat = await Categorie.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(cat);
});

// suppression
router.delete('/:id', async (req, res) => {
  await Categorie.findByIdAndDelete(req.params.id);
  res.json({ message: 'Catégorie supprimée' });
});

module.exports = router;
