const express = require('express');
const router = express.Router();
const Promotion = require('../models/Promotion');
const auth = require('../middlewares/auth');
const Shop = require('../models/Shop');

// GET promotions du shop connecté
router.get('/', auth, async (req, res) => {
  try {
    if(req.user.role !== 'shop') return res.status(403).json({ message: "Accès refusé" });
    const shop = await Shop.findOne({ owner: req.user.id });
    const promotions = await Promotion.find({ shop: shop._id }).populate('produits', 'name');
    res.json(promotions);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
});

// POST nouvelle promotion
router.post('/', auth, async (req, res) => {
  try {
    if(req.user.role !== 'shop') return res.status(403).json({ message: "Accès refusé" });
    const shop = await Shop.findOne({ owner: req.user.id });

    const { nom, produits, tauxReduction, dateDebut, dateFin } = req.body;

    const promo = new Promotion({
      nom,
      produits,
      tauxReduction,
      dateDebut,
      dateFin,
      shop: shop._id
    });

    await promo.save();
    res.status(201).json(promo);
  } catch(err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;