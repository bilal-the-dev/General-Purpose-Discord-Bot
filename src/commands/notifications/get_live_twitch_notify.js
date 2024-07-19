// setTwitchNotification.js
const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const {
  loadNotifications,
  saveNotifications,
  getAccessToken,
  getUserId,
} = require("../../utils/notifications/twitchUtils");

module.exports = {
  name: "set_twitch_notification",
  description: "Establece notificaciones para un canal de Twitch",
  options: [
    {
      name: "channel_name",
      description: "El nombre del canal de Twitch a monitorear",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],

  callback: async (client, interaction) => {
    await interaction.deferReply();
    const channelName = interaction.options.getString("channel_name");
    const discordChannelId = interaction.channelId;

    try {
      await getAccessToken();
      const userId = await getUserId(channelName);

      const notifications = await loadNotifications();
      notifications[channelName] = {
        userId,
        discordChannelId,
        isCurrentlyLive: false,
      };
      await saveNotifications(notifications);

      const embed = new EmbedBuilder()
        .setColor("#9146FF") // Twitch purple
        .setTitle("📺 Notificación de Twitch Configurada")
        .setDescription(`Ahora estás monitoreando el canal de Twitch:`)
        .addFields({
          name: "Nombre del Canal",
          value: channelName,
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

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      const errorEmbed = new EmbedBuilder()
        .setColor("#FF0000") // Error red
        .setTitle("❌ Error al Configurar Notificación de Twitch")
        .setDescription(
          `Se produjo un error al intentar configurar el monitoreo para el canal de Twitch: ${channelName}`
        )
        .addFields({
          name: "Mensaje de Error",
          value: error.message,
        })
        .setTimestamp()
        .setFooter({
          text: `Solicitado por ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL(),
        });

      await interaction.editReply({ embeds: [errorEmbed] });
    }
  },
};
