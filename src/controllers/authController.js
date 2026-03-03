const User = require('../models/User');
const Shop = require('../models/Shop');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// =========================
// REGISTER
// =========================

exports.register = async (req, res) => {
  
  try {

    let role = "acheteur";

    if (req.body.role === "shop") {
      role = "shop";
    }

    if (req.body.role === "admin") {
      return res.status(403).send({
        message: "You cannot register as admin."
      });
    }

    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).send({
        message: "Email already in use."
      });
    }
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: role,
      isActive: role === "shop" ? false : true
    });

    await user.save();

    if (role === "shop") {
      const shop = new Shop({
        name: req.body.shopName || req.body.name,
        description: req.body.shopDescription || '',
        owner: user._id,
        isValidated: false
      });
      await shop.save();
    }

    res.status(201).send({
      message: role === "shop"
        ? "Shop registered. Waiting for admin validation."
        : "User registered successfully."
    });

  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// =========================
// LOGIN
// =========================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("1. Tentative pour :", email);

    const user = await User.findOne({ email: email.toLowerCase().trim() }); // Nettoyage de l'email
    if (!user) {
      console.log("2. Utilisateur non trouvé en BDD");
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    console.log("3. Password saisi :", password);
    console.log("4. Hash en BDD :", user.password);

    // Utilise await pour la comparaison
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("5. Résultat match :", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    // Génération du token (vérifie que process.env.SECRET est bien défini)
    const secret = process.env.SECRET || 'ma_cle_de_secours'; 
    const token = jwt.sign({ id: user._id, role: user.role }, secret, { expiresIn: '24h' });

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      accessToken: token
    });

  } catch (err) {
    console.error("ERREUR LOGIN:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};