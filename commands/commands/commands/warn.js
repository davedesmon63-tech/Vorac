const fs = require("fs");

module.exports = {
  name: "warn",

  execute(message, args, log) {
    if (!message.member.permissions.has("ModerateMembers")) {
      return message.reply("❌ Pas la permission.");
    }

    const user = message.mentions.members.first();
    if (!user) return message.reply("❌ Mentionne un utilisateur.");

    const reason = args.slice(1).join(" ") || "Aucune raison";

    let warns = JSON.parse(fs.readFileSync("./data/warns.json", "utf8"));

    if (!warns[user.id]) warns[user.id] = [];

    warns[user.id].push({
      reason,
      moderator: message.author.id,
      date: Date.now()
    });

    fs.writeFileSync("./data/warns.json", JSON.stringify(warns, null, 2));

    message.channel.send(`⚠️ ${user.user.tag} a été warn.\nRaison: ${reason}`);

    if (log) {
      log(message.guild, `⚠️ WARN : ${user.user.tag} | ${reason}`);
    }

    // 🔥 Auto-mute si 3 warns
    if (warns[user.id].length >= 3) {
      user.timeout(10 * 60 * 1000, "3 warns atteints");

      message.channel.send(`🔇 ${user.user.tag} a été mute automatiquement (3 warns).`);

      if (log) {
        log(message.guild, `🔇 AUTO-MUTE : ${user.user.tag} (3 warns)`);
      }
    }
  }
};
