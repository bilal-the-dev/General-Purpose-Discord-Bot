// kickCronJob.js
const cron = require("node-cron");
const { EmbedBuilder } = require("discord.js");
const {
  loadNotifications,
  saveNotifications,
  checkIfUserIsLive,
} = require("./kickUtils");

async function checkAndNotifyAll(client) {
  const notifications = await loadNotifications();
  for (const [username, data] of Object.entries(notifications)) {
    try {
      const isLive = await checkIfUserIsLive(username);
      if (isLive && !data.isCurrentlyLive) {
        data.isCurrentlyLive = true;
        const channel = await client.channels.fetch(data.channelId);

        // Create and send the embed notification
        const embed = new EmbedBuilder()
          .setColor("#6441A4") // Kick purple
          .setTitle("📺 ¡Usuario en Vivo en Kick!")
          .setDescription(`${username} está ahora en vivo en Kick.`)
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
        `Error al verificar el estado en vivo de ${username}:`,
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
