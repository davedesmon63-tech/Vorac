module.exports = {
  name: "unban",

  async execute(message, args, log) {
    if (!message.member.permissions.has("BanMembers")) {
      return message.reply("❌ Pas la permission.");
    }

    const userId = args[0];
    if (!userId) return message.reply("❌ Donne l'ID de l'utilisateur.");

    try {
      await message.guild.members.unban(userId);

      message.channel.send(`🔓 Utilisateur débanni (ID: ${userId})`);

      if (log) {
        log(message.guild, `🔓 UNBAN : ${userId}`);
      }

    } catch (err) {
      console.error(err);
      message.reply("❌ Impossible de unban cet utilisateur.");
    }
  }
};
