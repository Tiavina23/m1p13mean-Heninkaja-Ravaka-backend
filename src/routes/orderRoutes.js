const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// insertion
router.post('/', async (req, res) => {
  const o = new Order(req.body);
  await o.save();
  res.status(201).json(o);
});

// select all
router.get('/', async (req, res) => {
  const orders = await Order.find().populate('buyer shop items.produit');
  res.json(orders);
});

// select one
router.get('/:id', async (req, res) => {
  const o = await Order.findById(req.params.id).populate('buyer shop items.produit');
  res.json(o);
});

// modif
router.put('/:id', async (req, res) => {
  const o = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(o);
});

// supprimer
router.delete('/:id', async (req, res) => {
  await Order.findByIdAndDelete(req.params.id);
  res.json({ message: 'Order supprimé' });
});

module.exports = router;
