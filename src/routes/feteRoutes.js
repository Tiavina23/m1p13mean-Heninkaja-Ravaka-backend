const express = require('express');
const router = express.Router();
const Fete = require('../models/Fete');
const auth = require('../middlewares/auth');

// GET toutes les fêtes
router.get('/', auth, async (req, res) => {
  try {
    const fetes = await Fete.find();
    res.json(fetes);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
});

// insertion
router.post('/', async (req, res) => {
    try {
      const fete = new Fete(req.body);
      await fete.save();
      res.status(201).json(fete);
    } catch(err) {
      res.status(400).json({ error: err.message });
    }
  });

module.exports = router;