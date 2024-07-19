// removeTwitchNotification.js
const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const {
  loadNotifications,
  saveNotifications,
} = require("../../utils/notifications/twitchUtils");

module.exports = {
  name: "remove_twitch_notification",
  description: "Eliminar notificaciones para un canal de Twitch",
  options: [
    {
      name: "channel_name",
      description: "El nombre del canal de Twitch para dejar de monitorear",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],

  callback: async (client, interaction) => {
    await interaction.deferReply();
    const channelName = interaction.options.getString("channel_name");

    const notifications = await loadNotifications();
    if (notifications[channelName]) {
      delete notifications[channelName];
      await saveNotifications(notifications);

      const successEmbed = new EmbedBuilder()
        .setColor("#9146FF") // Twitch purple
        .setTitle("✅ Notificaciones de Twitch Eliminadas")
        .setDescription(
          `Las notificaciones para el canal de Twitch ${channelName} han sido eliminadas.`
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
          `No se encontraron notificaciones para el canal de Twitch ${channelName}.`
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
