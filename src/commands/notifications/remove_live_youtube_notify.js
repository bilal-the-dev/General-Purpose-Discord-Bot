// removeYoutubeNotification.js
const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const {
  loadNotifications,
  saveNotifications,
  getChannelIdFromLink,
} = require("../../utils/notifications/youtubeUtils");

module.exports = {
  name: "remove_youtube_notification",
  description: "Eliminar notificaciones para un canal de YouTube",
  options: [
    {
      name: "channel_link",
      description: "El enlace del canal de YouTube para dejar de monitorear",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],

  callback: async (client, interaction) => {
    await interaction.deferReply();
    const channelLink = interaction.options.getString("channel_link");

    const channelId = getChannelIdFromLink(channelLink);
    if (!channelId) {
      const errorEmbed = new EmbedBuilder()
        .setColor("#FF0000") // Error red
        .setTitle("❌ Enlace de YouTube Inválido")
        .setDescription(
          "El enlace del canal de YouTube no es válido. Por favor, proporcione un enlace válido."
        )
        .setTimestamp()
        .setFooter({
          text: `Solicitado por ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL(),
        });

      await interaction.editReply({ embeds: [errorEmbed] });
      return;
    }

    const notifications = await loadNotifications();
    if (notifications[channelId]) {
      delete notifications[channelId];
      await saveNotifications(notifications);

      const successEmbed = new EmbedBuilder()
        .setColor("#FF0000") // YouTube red
        .setTitle("✅ Notificaciones de YouTube Eliminadas")
        .setDescription(
          `Las notificaciones para el canal de YouTube ${channelLink} han sido eliminadas.`
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
          `No se encontraron notificaciones para el canal de YouTube ${channelLink}.`
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
