require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

const userRoutes = require('./routes/userRoutes');
const shopRoutes = require('./routes/shopRoutes');
const categorieRoutes = require('./routes/categorieRoutes');
const produitRoutes = require('./routes/produitRoutes');
const orderRoutes = require('./routes/orderRoutes');

connectDB();

app.use('/api/users', userRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/categories', categorieRoutes);
app.use('/api/produits', produitRoutes);
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});