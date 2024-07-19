// removeInstagramNotification.js
const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const {
  loadNotifications,
  saveNotifications,
} = require("../../utils/notifications/instagramUtils");

module.exports = {
  name: "remove_instagram_notification",
  description: "Eliminar notificaciones para un perfil de Instagram",
  options: [
    {
      name: "profile_url",
      description: "El enlace del perfil de Instagram para dejar de monitorear",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],

  callback: async (client, interaction) => {
    await interaction.deferReply();
    const profileUrl = interaction.options.getString("profile_url");

    const notifications = await loadNotifications();
    if (notifications[profileUrl]) {
      delete notifications[profileUrl];
      await saveNotifications(notifications);

      const successEmbed = new EmbedBuilder()
        .setColor("#C13584") // Instagram's color
        .setTitle("✅ Notificaciones de Instagram Eliminadas")
        .setDescription(
          `Las notificaciones para el perfil de Instagram ${profileUrl} han sido eliminadas.`
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
          `No se encontraron notificaciones para el perfil de Instagram ${profileUrl}.`
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
