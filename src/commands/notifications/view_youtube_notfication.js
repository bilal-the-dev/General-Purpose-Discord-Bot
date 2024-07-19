// viewYoutubeNotificationList.js
const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { loadNotifications } = require("../../utils/notifications/youtubeUtils");
const { google } = require("googleapis");

const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY, // Make sure to set this in your environment variables
});

async function getChannelInfo(channelId) {
  try {
    const response = await youtube.channels.list({
      part: "snippet,statistics",
      id: channelId,
    });
    return response.data.items[0];
  } catch (error) {
    console.error("Error fetching YouTube channel info:", error);
    return null;
  }
}

module.exports = {
  name: "view_youtube_notification_list",
  description: "Ver la lista de canales de YouTube que se están monitoreando",
  permissionsRequired: [PermissionFlagsBits.Administrator],

  callback: async (client, interaction) => {
    await interaction.deferReply();

    const notifications = await loadNotifications();
    const channelCount = Object.keys(notifications).length;

    if (channelCount === 0) {
      const noChannelsEmbed = new EmbedBuilder()
        .setColor("#FF0000") // YouTube red
        .setTitle("📺 Lista de Notificaciones de YouTube")
        .setDescription(
          "Actualmente no se están monitoreando canales de YouTube."
        )
        .setTimestamp()
        .setFooter({
          text: `Solicitado por ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL(),
        });

      await interaction.editReply({ embeds: [noChannelsEmbed] });
      return;
    }

    const channelsDescription = await Promise.all(
      Object.entries(notifications).map(async ([channelId, data], index) => {
        const channelInfo = await getChannelInfo(channelId);

        if (channelInfo) {
          const { title, thumbnails, customUrl } = channelInfo.snippet;
          const { subscriberCount, videoCount } = channelInfo.statistics;

          return (
            `${index + 1}. ${title}\n` +
            `   [${customUrl || channelId}](${data.channelLink})\n` +
            `   📊 Suscriptores: ${parseInt(
              subscriberCount
            ).toLocaleString()}\n` +
            `   🎥 Videos: ${parseInt(videoCount).toLocaleString()}\n` +
            `   🔔 Notificaciones en: <#${data.discordChannelId}>\n` +
            `   📌 Último ID de video: \`${data.lastVideoId}\`\n`
          );
        } else {
          return (
            `${index + 1}. Canal ${channelId}\n` +
            `   [Ver Canal](${data.channelLink})\n` +
            `   🔔 Notificaciones en: <#${data.discordChannelId}>\n` +
            `   📌 Último ID de video: \`${data.lastVideoId}\`\n`
          );
        }
      })
    );

    const embed = new EmbedBuilder()
      .setColor("#FF0000") // YouTube red
      .setTitle("📺 Lista de Notificaciones de YouTube")
      .setDescription(
        `Monitoreando ${channelCount} canal${
          channelCount !== 1 ? "es" : ""
        }\n\n${channelsDescription.join("\n")}`
      )
      .setTimestamp()
      .setFooter({
        text: `Solicitado por ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      });

    await interaction.editReply({ embeds: [embed] });
  },
};
