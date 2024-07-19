// setKickNotification.js
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
  name: "set_kick_notification",
  description: "Establece notificaciones para un perfil en Kick",
  options: [
    {
      name: "username",
      description: "El nombre de usuario para recibir notificaciones",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],

  callback: async (client, interaction) => {
    await interaction.deferReply();
    const username = interaction.options.getString("username");
    const channelId = interaction.channelId;

    const notifications = await loadNotifications();
    notifications[username] = { channelId, isCurrentlyLive: false };
    await saveNotifications(notifications);

    const embed = new EmbedBuilder()
      .setColor("#6441A4") // Kick purple
      .setTitle("🎥 Notificación de Kick Configurada")
      .setDescription(`Ahora estás monitoreando el perfil de Kick:`)
      .addFields({
        name: "Nombre de Usuario",
        value: username,
      })
      .addFields({
        name: "Canal de Discord",
        value: `<#${channelId}>`,
      })
      .setTimestamp()
      .setFooter({
        text: `Solicitado por ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      });

    await interaction.editReply({ embeds: [embed] });
  },
};
