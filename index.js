const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const fs = require("fs");

// ✅ FIX IMPORTANT POUR RENDER (Chrome)
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox"
    ]
  }
});

// ❌ inutile (je l’ai retiré)
// qrcode.generate = qrcode.generate;

// QR CODE
client.on("qr", (qr) => {
  console.log("📱 Scan QR code WhatsApp");
  qrcode.generate(qr, { small: true });
});

// READY
client.on("ready", () => {
  console.log("✅ Bot WhatsApp prêt !");
});

// DATA WARN
let warns = {};
if (fs.existsSync("./warns.json")) {
  warns = JSON.parse(fs.readFileSync("./warns.json"));
}

function save() {
  fs.writeFileSync("./warns.json", JSON.stringify(warns, null, 2));
}

// MENU
function menu(message) {
  message.reply(
`🤖 MENU MODÉRATION

!warn @user
!warns
!kick @user
!ban @user
!info`
  );
}

// MESSAGE
client.on("message", async (message) => {
  const msg = message.body.toLowerCase();
  const chat = await message.getChat();

  // 📢 MENU
  if (msg === "!menu") return menu(message);

  // ⚠️ WARN
  if (msg.startsWith("!warn")) {
    const user = message.mentionedIds[0];
    if (!user) return message.reply("Mentionne un utilisateur");

    warns[user] = (warns[user] || 0) + 1;
    save();

    message.reply(`⚠️ Warn ajouté. Total: ${warns[user]}`);

    if (warns[user] >= 3) {
      message.reply("🚫 Trop de warns !");
    }
  }

  // 📊 WARNS
  if (msg.startsWith("!warns")) {
    const user = message.mentionedIds[0];
    if (!user) return message.reply("Mentionne quelqu’un");

    const count = warns[user] || 0;
    message.reply(`⚠️ Warns: ${count}`);
  }

  // 👢 KICK
  if (msg.startsWith("!kick")) {
    const user = message.mentionedIds[0];
    if (!user) return message.reply("Mentionne quelqu’un");

    await chat.removeParticipants([user]);
    message.reply("👢 Utilisateur retiré du groupe");
  }

  // 🚫 BAN
  if (msg.startsWith("!ban")) {
    const user = message.mentionedIds[0];
    if (!user) return message.reply("Mentionne quelqu’un");

    await chat.removeParticipants([user]);
    message.reply("🚫 BAN effectué (retiré du groupe)");
  }

  // ℹ️ INFO
  if (msg === "!info") {
    message.reply("🤖 Bot de modération WhatsApp actif");
  }
});

client.initialize();