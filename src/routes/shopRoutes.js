const express = require('express');
const router = express.Router();
const Shop = require('../models/Shop');

// insertion
router.post('/', async (req, res) => {
  try {
    const shop = new Shop(req.body);
    await shop.save();
    res.status(201).json(shop);
  } catch(err) {
    res.status(400).json({ error: err.message });
  }
});

// select all
router.get('/', async (req, res) => {
  const shops = await Shop.find().populate('owner');
  res.json(shops);
});

// select one
router.get('/:id', async (req, res) => {
  const shop = await Shop.findById(req.params.id).populate('owner');
  res.json(shop);
});

// modification
router.put('/:id', async (req, res) => {
  const shop = await Shop.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(shop);
});

// suppression
router.delete('/:id', async (req, res) => {
  await Shop.findByIdAndDelete(req.params.id);
  res.json({ message: 'Shop supprimé' });
});

module.exports = router;
