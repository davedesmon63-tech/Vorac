const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

app.post("/send", (req, res) => {
  console.log("Message:", req.body);
  res.json({ ok: true });
});

app.post("/warn", (req, res) => {
  console.log("Warn:", req.body);
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on", PORT));