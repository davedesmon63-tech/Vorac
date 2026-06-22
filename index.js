const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const fs = require("fs");

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    executablePath: process.env.CHROME_BIN || "/usr/bin/google-chrome-stable",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--single-process"
    ]
  }
});

client.on("qr", (qr) => {
  console.log("📱 Scan QR code WhatsApp");
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("✅ Bot WhatsApp prêt !");
});

// DATA (FIXÉ ✔)
let warns = {};

if (fs.existsSync("./warns.json")) {
  try {
    warns = JSON.parse(fs.readFileSync("./warns.json"));
  } catch (e) {
    warns = {};
  }
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

  if (msg === "!menu") return menu(message);

  // ⚠️ WARN
  if (msg.startsWith("!warn")) {
    const user = message.mentionedIds?.[0];
    if (!user) return message.reply("Mentionne un utilisateur");

    warns[user] = (warns[user] || 0) + 1;
    save();

    message.reply(`⚠️ Warn ajouté. Total: ${warns[user]}`);
  }

  // 📊 WARNS
  if (msg.startsWith("!warns")) {
    const user = message.mentionedIds?.[0];
    if (!user) return message.reply("Mentionne quelqu’un");

    message.reply(`⚠️ Warns: ${warns[user] || 0}`);
  }

  // 👢 KICK / BAN
  if (msg.startsWith("!kick") || msg.startsWith("!ban")) {
    const user = message.mentionedIds?.[0];

    if (!user) return message.reply("Mentionne quelqu’un");
    if (!chat.isGroup) return message.reply("❌ Commande uniquement en groupe");

    try {
      await chat.removeParticipants([user]);
      message.reply("🚫 Utilisateur retiré du groupe");
    } catch (err) {
      message.reply("❌ Impossible de retirer cet utilisateur");
    }
  }

  // ℹ️ INFO
  if (msg === "!info") {
    message.reply("🤖 Bot WhatsApp actif");
  }
});

client.initialize();