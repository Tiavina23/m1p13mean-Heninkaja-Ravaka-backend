const express = require('express');
const router = express.Router();
const Produit = require('../models/Produit');
const Shop = require('../models/Shop');
const { verifyToken } = require('../middlewares/authJwt');


// =========================
// AJOUTER PRODUIT (SHOP)
// =========================
router.post('/', verifyToken, async (req, res) => {
  try {

    if (req.user.role !== "shop") {
      return res.status(403).send({ message: "Only shops can add products" });
    }

    const shop = await Shop.findOne({ owner: req.user._id });

    if (!shop || !shop.isValidated) {
      return res.status(403).send({ message: "Shop not validated yet" });
    }

    const produit = new Produit({
      name: req.body.name,
      description: req.body.description,
      prix: req.body.prix,
      stock: req.body.stock,
      image: req.body.image,
      categorie: req.body.categorie,
      shop: shop._id
    });

    await produit.save();

    res.status(201).send(produit);

  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});


// =========================
// LISTE DES PRODUITS DU SHOP CONNECTÉ
// =========================
router.get('/my-products', verifyToken, async (req, res) => {
  try {

    if (req.user.role !== "shop") {
      return res.status(403).send({ message: "Access denied" });
    }

    const shop = await Shop.findOne({ owner: req.user._id });

    const produits = await Produit.find({ shop: shop._id })
      .populate('categorie');

    res.send(produits);

  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});


// =========================
// SUPPRIMER PRODUIT
// =========================
router.delete('/:id', verifyToken, async (req, res) => {
  try {

    const produit = await Produit.findById(req.params.id);

    if (!produit) {
      return res.status(404).send({ message: "Produit not found" });
    }

    const shop = await Shop.findOne({ owner: req.user._id });

    if (!shop || produit.shop.toString() !== shop._id.toString()) {
      return res.status(403).send({ message: "Not authorized" });
    }

    await produit.deleteOne();

    res.send({ message: "Produit deleted successfully" });

  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});


// =========================
// MODIFIER PRODUIT
// =========================
router.put('/:id', verifyToken, async (req, res) => {
  try {

    const produit = await Produit.findById(req.params.id);

    if (!produit) {
      return res.status(404).send({ message: "Produit not found" });
    }

    const shop = await Shop.findOne({ owner: req.user._id });

    if (!shop || produit.shop.toString() !== shop._id.toString()) {
      return res.status(403).send({ message: "Not authorized" });
    }

    produit.name = req.body.name || produit.name;
    produit.description = req.body.description || produit.description;
    produit.prix = req.body.prix || produit.prix;
    produit.stock = req.body.stock || produit.stock;
    produit.image = req.body.image || produit.image;
    produit.categorie = req.body.categorie || produit.categorie;

    await produit.save();

    res.send(produit);

  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

module.exports = router;