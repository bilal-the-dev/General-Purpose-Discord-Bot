require("dotenv").config();
const {
  setupCronJob: setupTwitchCronJob,
} = require("../../utils/notifications/twitchCronJob");
const { setupCronJob } = require("../../utils/notifications/kickCronJob");
const {
  setupCronJob: setupYoutubeCronJob,
} = require("../../utils/notifications/youtubeCronJob");

const {
  setupInstagramCronJob,
} = require("../../utils/notifications/instagramCronJob");
module.exports = (client) => {
  // client.application.commands.set([]);
  // client.guilds.cache.get("1218982026330243143").commands.set([]);
  setupCronJob(client);
  setupTwitchCronJob(client);
  setupYoutubeCronJob(client);
  setupInstagramCronJob(client);
  console.log(`${client.user.tag} is online.`);
};
