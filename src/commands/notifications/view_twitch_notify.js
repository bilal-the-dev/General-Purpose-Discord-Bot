// viewTwitchNotificationList.js
const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { loadNotifications } = require("../../utils/notifications/twitchUtils");

module.exports = {
  name: "view_twitch_notification_list",
  description: "Ver la lista de canales de Twitch que se están monitoreando",
  permissionsRequired: [PermissionFlagsBits.Administrator],

  callback: async (client, interaction) => {
    await interaction.deferReply();

    const notifications = await loadNotifications();
    const channelCount = Object.keys(notifications).length;

    if (channelCount === 0) {
      const noChannelsEmbed = new EmbedBuilder()
        .setColor("#9146FF") // Twitch purple
        .setTitle("📺 Lista de Notificaciones de Twitch")
        .setDescription(
          "Actualmente no se están monitoreando canales de Twitch."
        )
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
        ([username, data], index) =>
          `${index + 1}. ${username}\n` +
          `   🔔 Notificaciones en: <#${data.discordChannelId}>\n` +
          `   📌 Actualmente en vivo: \`${
            data.isCurrentlyLive ? "Sí" : "No"
          }\`\n`
      )
      .join("\n");

    const embed = new EmbedBuilder()
      .setColor("#9146FF") // Twitch purple
      .setTitle("📺 Lista de Notificaciones de Twitch")
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
