const { google } = require("googleapis");
const youtube = google.youtube("v3");
const apiKey = "AIzaSyA_ULSwddpFsUfDqsOx-yGFYFSSdq6TgFQ";

const channelLink = "https://www.youtube.com/channel/UCZ8zGexoK6QmSv5uznHoPgQ"; // Replace with the YouTube channel link you want to monitor
let lastCheckedVideoId = null;

function getChannelIdFromLink(link) {
  const regex = /youtube\.com\/(?:channel\/|user\/)?([a-zA-Z0-9_-]+)/;
  const match = link.match(regex);
  return match ? match[1] : null;
}

async function checkForNewVideos(channelId) {
  const response = await youtube.search.list({
    part: "snippet",
    channelId: channelId,
    order: "date",
    maxResults: 1,
    key: apiKey,
  });

  if (response.data.items.length > 0) {
    const latestVideo = response.data.items[0];
    const latestVideoId = latestVideo.id.videoId;

    if (lastCheckedVideoId && lastCheckedVideoId !== latestVideoId) {
      console.log(`New video posted: ${latestVideo.snippet.title}`);
    }

    lastCheckedVideoId = latestVideoId;
  }
}

async function startMonitoring() {
  try {
    const channelId = getChannelIdFromLink(channelLink);
    if (!channelId) {
      throw new Error("Invalid channel link");
    }
    console.log(`Monitoring channel ID: ${channelId}`);

    // Fetch the latest video ID initially but do not log it
    await checkForNewVideos(channelId);

    // Start the interval check
    setInterval(() => {
      checkForNewVideos(channelId);
    }, 60000); // Check every minute
  } catch (error) {
    console.error("Error:", error.message);
  }
}

startMonitoring();
