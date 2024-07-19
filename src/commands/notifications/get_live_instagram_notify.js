// setInstagramNotification.js
const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const {
  loadNotifications,
  saveNotifications,
  checkForNewPosts,
} = require("../../utils/notifications/instagramUtils");

module.exports = {
  name: "set_instagram_notification",
  description: "Establece notificaciones para un perfil de Instagram",
  options: [
    {
      name: "profile_url",
      description: "La URL del perfil de Instagram a monitorear",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],

  callback: async (client, interaction) => {
    await interaction.deferReply();
    const profileUrl = interaction.options.getString("profile_url");
    const discordChannelId = interaction.channelId;

    const notifications = await loadNotifications();
    const latestPostUrl = await checkForNewPosts(profileUrl);

    notifications[profileUrl] = {
      discordChannelId,
      lastPostUrl: latestPostUrl,
    };
    await saveNotifications(notifications);

    const embed = new EmbedBuilder()
      .setColor("#E4405F")
      .setTitle("📸 Notificación de Instagram Configurada")
      .setDescription(`Ahora estás monitoreando el perfil de Instagram:`)
      .addFields({
        name: "Perfil de Instagram",
        value: `[${profileUrl}](${profileUrl})`,
      })
      .addFields({
        name: "Canal de Discord",
        value: `<#${discordChannelId}>`,
      })
      .addFields({
        name: "Última publicación",
        value: latestPostUrl
          ? `[Ver última publicación](${latestPostUrl})`
          : "No se ha encontrado ninguna publicación aún.",
      })
      .setTimestamp()
      .setFooter({
        text: `Solicitado por ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      });

    await interaction.editReply({ embeds: [embed] });
  },
};
