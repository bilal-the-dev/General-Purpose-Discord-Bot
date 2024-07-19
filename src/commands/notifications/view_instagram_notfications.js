// viewInstagramNotificationList.js
const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const {
  loadNotifications,
} = require("../../utils/notifications/instagramUtils");

module.exports = {
  name: "view_instagram_notification_list",
  description:
    "Ver la lista de perfiles de Instagram que se están monitoreando",
  permissionsRequired: [PermissionFlagsBits.Administrator],

  callback: async (client, interaction) => {
    await interaction.deferReply();

    const notifications = await loadNotifications();
    const profileCount = Object.keys(notifications).length;

    if (profileCount === 0) {
      const noProfilesEmbed = new EmbedBuilder()
        .setColor("#E1306C")
        .setTitle("📸 Lista de Notificaciones de Instagram")
        .setDescription(
          "Actualmente no se están monitoreando perfiles de Instagram."
        )
        .setTimestamp()
        .setFooter({
          text: `Solicitado por ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL(),
        });

      await interaction.editReply({ embeds: [noProfilesEmbed] });
      return;
    }

    const profilesDescription = Object.entries(notifications)
      .map(
        ([profileUrl, data], index) =>
          `${index + 1}. [${profileUrl
            .split("/")
            .filter(Boolean)
            .pop()}](${profileUrl})\n` +
          `   Notificaciones en: <#${data.discordChannelId}>`
      )
      .join("\n\n");

    const embed = new EmbedBuilder()
      .setColor("#E1306C")
      .setTitle("📸 Lista de Notificaciones de Instagram")
      .setDescription(
        `Monitoreando ${profileCount} perfil${
          profileCount !== 1 ? "es" : ""
        }\n\n${profilesDescription}`
      )
      .setTimestamp()
      .setFooter({
        text: `Solicitado por ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      });

    await interaction.editReply({ embeds: [embed] });
  },
};
