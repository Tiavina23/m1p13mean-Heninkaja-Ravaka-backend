const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Shop = require('../models/Shop');
const mongoose = require('mongoose');
const authController = require('../controllers/authController');

// AUTH
router.post('/register', authController.register);
router.post('/login', authController.login);

// =========================
// GET SHOPS EN ATTENTE
// =========================
router.get('/pending-shops', async (req, res) => {
  try {

    const shops = await Shop.find({ isValidated: false })
      .populate('owner', 'name email');

    console.log("Shops trouvés:", shops); 
    res.status(200).json(shops)

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =========================
// VALIDATION SHOP
// =========================
router.put('/validate-shop/:id', async (req, res) => {
  try {

    const shop = await Shop.findById(req.params.id);

    if (!shop) {
      return res.status(404).json({ message: "Shop non trouvé" });
    }

    // 1️⃣ Valider shop
    shop.isValidated = true;
    await shop.save();

    // 2️⃣ Activer le user
    await User.findByIdAndUpdate(shop.owner, { isActive: true });

    res.json({ message: "Shop validé avec succès" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/all-shops', async (req, res) => {
  try {

    const shops = await Shop.find()
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(shops);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.delete('/delete-shop/:id', async (req, res) => {
  try {

    const shop = await Shop.findById(req.params.id);
    if (!shop) {
      return res.status(404).json({ message: "Shop non trouvé" });
    }

    await Shop.findByIdAndDelete(req.params.id);

    await User.findByIdAndDelete(shop.owner);

    res.json({ message: "Shop supprimé avec succès" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch(err) {
    res.status(404).json({ error: 'User non trouvé' });
  }
});
module.exports = router;