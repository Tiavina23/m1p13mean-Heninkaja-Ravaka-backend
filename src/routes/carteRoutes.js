const express = require('express');
const router = express.Router();
const carteCtrl = require('../controllers/carteController');

// Pas besoin de middleware d'auth ici car les clients doivent voir la carte
router.get('/', carteCtrl.getCarte);

module.exports = router;