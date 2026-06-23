let revenus = 0;

app.get("/data", (req, res) => {
  res.json({
    name: "Vorax Business",
    status: "actif",
    revenus: revenus + " FCFA"
  });
});