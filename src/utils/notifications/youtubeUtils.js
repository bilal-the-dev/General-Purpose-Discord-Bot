// youtubeUtils.js
const fs = require("fs").promises;
const path = require("path");
const { google } = require("googleapis");
const youtube = google.youtube("v3");

const notificationsFile = path.join(__dirname, "youtubeNotifications.json");
const apiKey = process.env.YOUTUBE_APIKEY;
console.log({apiKey});
async function loadNotifications() {
  try {
    const data = await fs.readFile(notificationsFile, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error loading notifications:", error);
    return {};
  }
}

async function saveNotifications(notifications) {
  try {
    await fs.writeFile(
      notificationsFile,
      JSON.stringify(notifications, null, 2)
    );
  } catch (error) {
    console.error("Error saving notifications:", error);
  }
}

function getChannelIdFromLink(link) {
  const regex = /youtube\.com\/(?:channel\/|user\/)?([a-zA-Z0-9_-]+)/;
  const match = link.match(regex);
  return match ? match[1] : null;
}

async function checkForNewVideos(channelId) {
  try {
    const response = await youtube.search.list({
      part: "snippet",
      channelId: channelId,
      order: "date",
      maxResults: 1,
      key: apiKey,
    });

    if (response.data.items.length > 0) {
      const latestVideo = response.data.items[0];
      return {
        videoId: latestVideo.id.videoId,
        title: latestVideo.snippet.title,
      };
    }
    return null;
  } catch (error) {
    console.error("Error checking for new videos:", error);
    return null;
  }
}

module.exports = {
  loadNotifications,
  saveNotifications,
  getChannelIdFromLink,
  checkForNewVideos,
};
