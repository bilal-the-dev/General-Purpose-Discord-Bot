// twitchCronJob.js
const cron = require("node-cron");
const { EmbedBuilder } = require("discord.js");
const {
  loadNotifications,
  saveNotifications,
  getAccessToken,
  checkIfLive,
} = require("./twitchUtils");

async function checkAndNotifyAll(client) {
  await getAccessToken();
  const notifications = await loadNotifications();
  for (const [channelName, data] of Object.entries(notifications)) {
    try {
      const isLive = await checkIfLive(data.userId);
      if (isLive && !data.isCurrentlyLive) {
        data.isCurrentlyLive = true;
        const channel = await client.channels.fetch(data.discordChannelId);

        // Create and send the embed notification
        const embed = new EmbedBuilder()
          .setColor("#9146FF") // Twitch purple
          .setTitle("🎮 ¡Canal en Vivo en Twitch!")
          .setDescription(`${channelName} está ahora en vivo en Twitch.`)
          .setURL(`https://twitch.tv/${channelName}`)
          .setTimestamp()
          .setFooter({
            text: `Notificación automática`,
            iconURL: client.user.displayAvatarURL(),
          });

        await channel.send({ embeds: [embed] });
      } else if (!isLive) {
        data.isCurrentlyLive = false;
      }
    } catch (err) {
      console.error(
        `Error al verificar el estado en vivo de ${channelName}:`,
        err
      );
    }
  }
  await saveNotifications(notifications);
}

function setupCronJob(client) {
  cron.schedule("*/1 * * * *", () => checkAndNotifyAll(client));
}

module.exports = { setupCronJob };
