const Shop = require('../models/Shop');

exports.getPendingShops = async (req, res) => {
  const shops = await Shop.find({ isValidated: false }).populate('owner');
  res.json(shops);
};

exports.validateShop = async (req, res) => {
  await Shop.findByIdAndUpdate(req.params.id, { isValidated: true });
  res.json({ message: "Shop validated successfully" });
};