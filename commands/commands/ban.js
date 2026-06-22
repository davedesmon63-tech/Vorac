module.exports = {
  name: "ban",

  async execute(message, args, log) {
    if (!message.member.permissions.has("BanMembers")) {
      return message.reply("❌ Pas la permission.");
    }

    const user = message.mentions.members.first();
    if (!user) return message.reply("❌ Mentionne un utilisateur.");

    const reason = args.slice(1).join(" ") || "Aucune raison";

    try {
      await user.ban({ reason });

      message.channel.send(`🚫 ${user.user.tag} a été banni.\nRaison: ${reason}`);

      if (log) {
        log(message.guild, `🚫 BAN : ${user.user.tag} | ${reason}`);
      }

    } catch (err) {
      console.error(err);
      message.reply("❌ Impossible de bannir cet utilisateur.");
    }
  }
};
