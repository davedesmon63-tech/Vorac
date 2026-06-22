module.exports = {
  name: "mod",

  async execute(message, args, log) {
    if (!message.member.permissions.has("ManageMessages")) {
      return message.reply("❌ Pas la permission.");
    }

    const action = args[0];
    const user = message.mentions.members.first();

    // 🚪 KICK
    if (action === "kick") {
      if (!user) return message.reply("❌ Mentionne un utilisateur.");

      const reason = args.slice(2).join(" ") || "Aucune raison";

      await user.kick(reason);
      message.channel.send(`👢 ${user.user.tag} kick`);

      if (log) log(message.guild, `👢 KICK : ${user.user.tag} | ${reason}`);
    }

    // 🧹 CLEAR
    else if (action === "clear") {
      const amount = parseInt(args[1]) || 10;

      await message.channel.bulkDelete(amount, true);
      message.channel.send(`🧹 ${amount} messages supprimés`)
        .then(m => setTimeout(() => m.delete(), 3000));

      if (log) log(message.guild, `🧹 CLEAR : ${amount} messages`);
    }

    // 🔒 LOCK
    else if (action === "lock") {
      message.channel.permissionOverwrites.edit(message.guild.roles.everyone, {
        SendMessages: false
      });

      message.channel.send("🔒 Salon verrouillé");

      if (log) log(message.guild, `🔒 LOCK : ${message.channel.name}`);
    }

    // ℹ️ INFO
    else if (action === "info") {
      if (!user) return message.reply("❌ Mentionne un utilisateur.");

      message.channel.send(
        `ℹ️ Info :
👤 ${user.user.tag}
🆔 ${user.id}
📅 Rejoint : ${user.joinedAt}`
      );

      if (log) log(message.guild, `ℹ️ INFO : ${user.user.tag}`);
    }

    else {
      message.reply("❌ Utilise: kick, clear, lock, info");
    }
  }
};
