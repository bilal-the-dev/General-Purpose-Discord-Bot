// youtubeCronJob.js
const cron = require("node-cron");
const { EmbedBuilder } = require("discord.js");
const {
  loadNotifications,
  saveNotifications,
  checkForNewVideos,
} = require("./youtubeUtils");

async function checkAndNotifyAll(client) {
  const notifications = await loadNotifications();
  for (const [channelId, data] of Object.entries(notifications)) {
    try {
      const latestVideo = await checkForNewVideos(channelId);
      if (latestVideo && latestVideo.videoId !== data.lastVideoId) {
        const channel = await client.channels.fetch(data.discordChannelId);

        // Create and send the embed notification
        const embed = new EmbedBuilder()
          .setColor("#FF0000") // YouTube red
          .setTitle("🎥 Nuevo Video en YouTube")
          .setDescription(
            `Nuevo video publicado en el canal [${data.channelLink}](${data.channelLink})`
          )
          .addFields(
            { name: "Título", value: latestVideo.title },
            { name: "Ver Video", value: `[Aquí](${latestVideo.url})` }
          )
          .setTimestamp()
          .setFooter({
            text: `Notificación automática`,
            iconURL: client.user.displayAvatarURL(),
          });

        await channel.send({ embeds: [embed] });
        data.lastVideoId = latestVideo.videoId;
      }
    } catch (err) {
      console.error(
        `Error al verificar nuevos videos para ${data.channelLink}:`,
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
