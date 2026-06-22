module.exports = {
  name: "unmute",

  async execute(message, args, log) {
    if (!message.member.permissions.has("ModerateMembers")) {
      return message.reply("❌ Pas la permission.");
    }

    const user = message.mentions.members.first();
    if (!user) return message.reply("❌ Mentionne un utilisateur.");

    try {
      await user.timeout(null);

      message.channel.send(`🔊 ${user.user.tag} a été unmute.`);

      if (log) {
        log(message.guild, `🔊 UNMUTE : ${user.user.tag}`);
      }

    } catch (err) {
      console.error(err);
      message.reply("❌ Impossible de unmute cet utilisateur.");
    }
  }
};
