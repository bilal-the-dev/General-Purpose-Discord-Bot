// instagramCronJob.js
const cron = require("node-cron");
const { EmbedBuilder } = require("discord.js");
const {
  loadNotifications,
  saveNotifications,
  initializeBrowser,
  checkForNewPosts,
} = require("./instagramUtils");

async function checkAndNotifyAll(client) {
  const notifications = await loadNotifications();
  for (const [profileUrl, data] of Object.entries(notifications)) {
    try {
      const latestPostUrl = await checkForNewPosts(profileUrl);
      if (latestPostUrl && latestPostUrl !== data.lastPostUrl) {
        const channel = await client.channels.fetch(data.discordChannelId);

        // Create and send the embed notification
        const embed = new EmbedBuilder()
          .setColor("#E1306C") // Instagram pink
          .setTitle("📸 ¡Nuevo Post en Instagram!")
          .setDescription(
            `Se ha publicado un nuevo post en el perfil de Instagram: [${profileUrl}](${profileUrl})`
          )
          .setURL(latestPostUrl)
          .setTimestamp()
          .setFooter({
            text: `Notificación automática`,
            iconURL: client.user.displayAvatarURL(),
          });

        await channel.send({ embeds: [embed] });
        data.lastPostUrl = latestPostUrl;
      }
    } catch (err) {
      console.error(`Error al verificar nuevos posts para ${profileUrl}:`, err);
    }
  }
  await saveNotifications(notifications);
}

function setupInstagramCronJob(client) {
  const username = process.env.INSTAGRAM_USERNAME;
  const password = process.env.INSTAGRAM_PASSWORD;

  initializeBrowser(username, password).then(() => {
    cron.schedule("*/1 * * * *", () => checkAndNotifyAll(client));
  });
}

module.exports = { setupInstagramCronJob };
