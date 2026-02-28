const express = require('express');
const router = express.Router();
const Produit = require('../models/Produit');
const Shop = require('../models/Shop');
const auth = require('../middlewares/auth');
const multer = require('multer');
const path = require('path');

// Multer pour upload image
const storage = multer.diskStorage({
  destination: (req,file,cb)=>cb(null,'src/uploads/'),
  filename: (req,file,cb)=>cb(null, Date.now()+path.extname(file.originalname))
});
const upload = multer({ storage });

// Ajouter produit
router.post('/', auth, upload.single('image'), async (req,res)=>{
  if(req.user.role!=='shop') return res.status(403).json({ message:"Accès refusé" });
  const shop = await Shop.findOne({ owner: req.user.id });

  const produit = new Produit({
    name:req.body.name,
    description:req.body.description,
    prix:req.body.prix,
    stock:req.body.stock,
    categorie:req.body.categorie,
    shop:shop._id,
    image:req.file ? req.file.filename : ''
  });
  await produit.save();
  res.json(produit);
});

// select all
router.get('/allproduit', async (req, res) => {
  const produits = await Produit.find().populate('categorie shop');
  res.json(produits);
});

// Lister produits du shop connecté
router.get('/', auth, async (req,res)=>{
  if(req.user.role!=='shop') return res.status(403).json({ message:"Accès refusé" });
  const shop = await Shop.findOne({ owner: req.user.id });
  const produits = await Produit.find({ shop:shop._id }).populate('categorie','name');
  res.json(produits);
});

// select one
/* router.get('/:id', async (req, res) => {
  const p = await Produit.findById(req.params.id).populate('categorie shop');
  res.json(p);
});

// modification
router.put('/:id', async (req, res) => {
  const p = await Produit.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(p);
}); */
router.put('/:id', auth, upload.single('image'), async (req,res)=>{
  const produit = await Produit.findById(req.params.id);
  if(!produit) return res.status(404).json({ message:"Produit introuvable" });
  if(req.user.role==='shop' && produit.shop.toString()!==req.user.id) return res.status(403).json({ message:"Accès refusé" });

  produit.name=req.body.name;
  produit.description=req.body.description;
  produit.price=req.body.price;
  produit.stock=req.body.stock;
  produit.categorie=req.body.categorie;
  if(req.file) produit.image=req.file.filename;

  await produit.save();
  res.json(produit);
});

// suppression
router.delete('/:id', async (req, res) => {
  await Produit.findByIdAndDelete(req.params.id);
  res.json({ message: 'Produit supprimée' });
});
module.exports = router;
