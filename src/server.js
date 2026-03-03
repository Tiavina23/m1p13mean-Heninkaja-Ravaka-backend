require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const express = require('express');
const path = require('path');

const userRoutes = require('./routes/userRoutes');
const shopRoutes = require('./routes/shopRoutes');
const categorieRoutes = require('./routes/categorieRoutes');
const produitRoutes = require('./routes/produitRoutes');
const orderRoutes = require('./routes/orderRoutes');
const promotionRoutes = require('./routes/promotionRoutes');
const feteRoutes = require('./routes/feteRoutes');

const carteRoutes = require('./routes/carteRoutes');


connectDB();

app.use('/api/users', userRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/categories', categorieRoutes);
app.use('/api/produits', produitRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/fetes', feteRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/carte', carteRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});