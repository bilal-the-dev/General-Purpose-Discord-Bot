// removeKickNotification.js
const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const {
  loadNotifications,
  saveNotifications,
} = require("../../utils/notifications/kickUtils");

module.exports = {
  name: "remove_kick_notification",
  description: "Eliminar notificaciones para un usuario de Kick",
  options: [
    {
      name: "username",
      description: "Nombre de usuario para eliminar notificaciones",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],

  callback: async (client, interaction) => {
    await interaction.deferReply();
    const username = interaction.options.getString("username");

    const notifications = await loadNotifications();
    if (notifications[username]) {
      delete notifications[username];
      await saveNotifications(notifications);

      const successEmbed = new EmbedBuilder()
        .setColor("#6441A4") // Kick purple
        .setTitle("✅ Notificaciones de Kick Eliminadas")
        .setDescription(
          `Las notificaciones para el usuario de Kick ${username} han sido eliminadas.`
        )
        .setTimestamp()
        .setFooter({
          text: `Solicitado por ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL(),
        });

      await interaction.editReply({ embeds: [successEmbed] });
    } else {
      const errorEmbed = new EmbedBuilder()
        .setColor("#FF0000") // Error red
        .setTitle("❌ No se Encontraron Notificaciones")
        .setDescription(
          `No se encontraron notificaciones para el usuario de Kick ${username}.`
        )
        .setTimestamp()
        .setFooter({
          text: `Solicitado por ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL(),
        });

      await interaction.editReply({ embeds: [errorEmbed] });
    }
  },
};
