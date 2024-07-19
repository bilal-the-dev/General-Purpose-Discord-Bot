// setYoutubeNotification.js
const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const {
  loadNotifications,
  saveNotifications,
  getChannelIdFromLink,
  checkForNewVideos,
} = require("../../utils/notifications/youtubeUtils");

module.exports = {
  name: "set_youtube_notification",
  description: "Establece notificaciones para un canal de YouTube",
  options: [
    {
      name: "channel_link",
      description: "El enlace del canal de YouTube a monitorear",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],

  callback: async (client, interaction) => {
    await interaction.deferReply();
    const channelLink = interaction.options.getString("channel_link");
    const discordChannelId = interaction.channelId;

    const channelId = getChannelIdFromLink(channelLink);
    if (!channelId) {
      const errorEmbed = new EmbedBuilder()
        .setColor("#FF0000") // Error red
        .setTitle("❌ Enlace de YouTube Inválido")
        .setDescription(
          "El enlace del canal de YouTube proporcionado no es válido. Por favor, proporciona un enlace válido."
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
    const latestVideo = await checkForNewVideos(channelId);

    notifications[channelId] = {
      discordChannelId,
      channelLink,
      lastVideoId: latestVideo ? latestVideo.videoId : null,
    };
    await saveNotifications(notifications);

    const successEmbed = new EmbedBuilder()
      .setColor("#FF0000") // YouTube red
      .setTitle("📺 Notificación de YouTube Configurada")
      .setDescription("Ahora estás monitoreando el canal de YouTube:")
      .addFields({
        name: "Enlace del Canal",
        value: channelLink,
      })
      .addFields({
        name: "Canal de Discord",
        value: `<#${discordChannelId}>`,
      })
      .setTimestamp()
      .setFooter({
        text: `Solicitado por ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      });

    await interaction.editReply({ embeds: [successEmbed] });
  },
};
