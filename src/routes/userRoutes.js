const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authController = require('../controllers/authController');

// Register a new user
router.post('/', async (req, res) => {
  try{
  
      const newUser = new User(req.body).save();
      res.status(201).json({message: 'User registered successfully' });
  } catch (error) {
      res.status(400).json({ error: 'User already exists' });
  }
});

/* insertion
router.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch(err) {
    res.status(400).json({ error: err.message });
  }
}); */

// select all
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// select one
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch(err) {
    res.status(404).json({ error: 'User non trouvé' });
  }
});

// modification
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(user);
  } catch(err) {
    res.status(400).json({ error: err.message });
  }
});

// suppression
router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Utilisateur supprimé' });
  } catch(err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/register', authController.register);
router.post('/login', authController.login);


router.get('/pending-shops', async (req, res) => {
  const shops = await User.find({ role: 'shop', isActive: false });
  res.json(shops);
});

router.put('/validate/:id', async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { isActive: true });
  res.json({ message: "Shop validated successfully" });
});

module.exports = router;
