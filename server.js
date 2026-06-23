const express = require("express");
const app = express();

// 🔥 IMPORTANT
app.use(express.json());
app.use(express.static("public"));

// 💰 variable revenus
let revenus = 0;

// 📊 route API
app.get("/data", (req, res) => {
  res.json({
    name: "Vorax Business",
    status: "actif",
    revenus: revenus + " FCFA"
  });
});

// 🚀 lancer serveur
app.listen(3000, () => {
  console.log("Serveur lancé sur port 3000");
});