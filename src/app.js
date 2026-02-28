const express = require("express");
const cors = require("cors");
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // images accessibles

app.get("/", (req, res) => {
  res.send("API running");
});

module.exports = app;