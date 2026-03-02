const express = require('express');
const router = express.Router();
const Shop = require('../models/Shop');
const User = require('../models/User');
const { verifyToken, verifyAdmin } = require('../middlewares/authJwt');

// Valider un shop
  router.put('/validate-shop/:id', verifyToken, verifyAdmin, async (req, res) => {
    try {

      const shop = await Shop.findById(req.params.id);

      if (!shop) {
        return res.status(404).send({ message: "Shop not found" });
      }

      // Valider shop
      shop.isValidated = true;
      await shop.save();

      // Activer le user owner
      await User.findByIdAndUpdate(shop.owner, { isActive: true });

      res.send({ message: "Shop validated successfully" });

    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  });

  router.get('/pending-shops', async (req, res) => {
    try {
      const shops = await User.find({ role: 'shop', isActive: false }).select('-password');
      res.json(shops);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  router.get('/all-shops', async (req, res) => {
    try {
      const shops = await User.find({ role: 'shop' }).select('-password');
      res.json(shops);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
module.exports = router;