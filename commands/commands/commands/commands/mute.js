module.exports = {
  name: "mute",

  async execute(message, args, log) {
    if (!message.member.permissions.has("ModerateMembers")) {
      return message.reply("❌ Pas la permission.");
    }

    const user = message.mentions.members.first();
    if (!user) return message.reply("❌ Mentionne un utilisateur.");

    const time = parseInt(args[1]) || 10; // en minutes

    try {
      await user.timeout(time * 60 * 1000, "Mute modération");

      message.channel.send(`🔇 ${user.user.tag} mute ${time} minutes.`);

      if (log) {
        log(message.guild, `🔇 MUTE : ${user.user.tag} | ${time} min`);
      }

    } catch (err) {
      console.error(err);
      message.reply("❌ Impossible de mute cet utilisateur.");
    }
  }
};
