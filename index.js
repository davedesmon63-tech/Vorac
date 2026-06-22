const { Client, LocalAuth } = require("whatsapp-web.js");
const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  }
});

let warns = {};
if (fs.existsSync("./warns.json")) {
  warns = JSON.parse(fs.readFileSync("./warns.json"));
}

function save() {
  fs.writeFileSync("./warns.json", JSON.stringify(warns, null, 2));
}

// WhatsApp Ready
client.on("ready", () => {
  console.log("Bot prêt !");
});

// API : envoyer message dans groupe
app.post("/send", async (req, res) => {
  const { groupId, message } = req.body;

  try {
    const chat = await client.getChatById(groupId);
    await chat.sendMessage(message);
    res.send({ ok: true });
  } catch (e) {
    res.send({ ok: false, error: e.message });
  }
});

// API : warn user
app.post("/warn", (req, res) => {
  const { user } = req.body;

  warns[user] = (warns[user] || 0) + 1;
  save();

  res.send({ ok: true, warns: warns[user] });
});

// serveur web
app.listen(3000, () => {
  console.log("API running on port 3000");
});

client.initialize();