// viewKickNotificationList.js
const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { loadNotifications } = require("../../utils/notifications/kickUtils");

module.exports = {
  name: "view_kick_notification_list",
  description: "Ver la lista de canales de Kick que se están monitoreando",
  permissionsRequired: [PermissionFlagsBits.Administrator],

  callback: async (client, interaction) => {
    await interaction.deferReply();

    const notifications = await loadNotifications();
    const channelCount = Object.keys(notifications).length;

    if (channelCount === 0) {
      const noChannelsEmbed = new EmbedBuilder()
        .setColor("#6441A4") // Kick purple
        .setTitle("📺 Lista de Notificaciones de Kick")
        .setDescription("Actualmente no se están monitoreando canales de Kick.")
        .setTimestamp()
        .setFooter({
          text: `Solicitado por ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL(),
        });

      await interaction.editReply({ embeds: [noChannelsEmbed] });
      return;
    }

    const channelsDescription = Object.entries(notifications)
      .map(
        ([channelId, data], index) =>
          `${index + 1}. Canal ${channelId}\n` +
          `   Notificaciones en: <#${data.channelId}>\n` +
          `   📌 Actualmente en vivo: \`${data.isCurrentlyLive ? "Sí" : "No"}\``
      )
      .join("\n\n");

    const embed = new EmbedBuilder()
      .setColor("#6441A4") // Kick purple
      .setTitle("📺 Lista de Notificaciones de Kick")
      .setDescription(
        `Monitoreando ${channelCount} canal${
          channelCount !== 1 ? "es" : ""
        }\n\n${channelsDescription}`
      )
      .setTimestamp()
      .setFooter({
        text: `Solicitado por ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      });

    await interaction.editReply({ embeds: [embed] });
  },
};
