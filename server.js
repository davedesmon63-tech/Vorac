const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

let revenus = 0;

app.get("/data", (req, res) => {
  res.json({
    name: "Vorax Business",
    status: "actif",
    revenus: revenus + " FCFA"
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Serveur lancé sur port " + PORT);
});