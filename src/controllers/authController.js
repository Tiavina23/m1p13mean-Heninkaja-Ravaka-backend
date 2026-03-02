const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// =========================
// REGISTER
// =========================
exports.register = async (req, res) => {
  try {

    let role = "acheteur"; // rôle par défaut

    // Autoriser seulement shop ou acheteur
    if (req.body.role === "shop") {
      role = "shop";
    }

    // Interdire création admin via register
    if (req.body.role === "admin") {
      return res.status(403).send({
        message: "You cannot register as admin."
      });
    }

    // Vérifier si email existe déjà
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).send({
        message: "Email already in use."
      });
    }

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      role: role,
      isActive: role === "shop" ? false : true // shop doit être validé
    });

    await user.save();

    res.status(201).send({
      message: role === "shop"
        ? "Shop registered successfully. Waiting for admin approval."
        : "User registered successfully!"
    });

  } catch (err) {
    res.status(500).send({
      message: err.message
    });
  }
};



// =========================
// LOGIN
// =========================
exports.login = async (req, res) => {
  try {

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).send({
        message: "User not found."
      });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid password."
      });
    }

    // Bloquer shop non validé
    if (user.role === "shop" && !user.isActive) {
      return res.status(403).send({
        message: "Your shop account is waiting for admin validation."
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.SECRET,
      { expiresIn: 86400 } // 24h
    );

    res.status(200).send({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      accessToken: token
    });

  } catch (err) {
    res.status(500).send({
      message: err.message
    });
  }
};