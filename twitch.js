const axios = require("axios");
const clientId = "5z6v50ifrxti2v7pdot4qzg8wu6xlk";
const clientSecret = "azv3x3ogwkvh9plgzgy507hy72eylx";
let accessToken = "";
const channelName = "ahsanfr124";

async function getAccessToken() {
  try {
    const response = await axios.post(
      `https://id.twitch.tv/oauth2/token`,
      null,
      {
        params: {
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: "client_credentials",
        },
      }
    );

    accessToken = response.data.access_token;
  } catch (error) {
    console.error("Error fetching access token:", error.message);
  }
}

async function getUserId(userName) {
  try {
    const response = await axios.get(`https://api.twitch.tv/helix/users`, {
      headers: {
        "Client-ID": clientId,
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        login: userName,
      },
    });

    if (response.data.data.length > 0) {
      return response.data.data[0].id;
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Error fetching user ID:", error.message);
  }
}

async function checkIfLive(userId) {
  try {
    const response = await axios.get(`https://api.twitch.tv/helix/streams`, {
      headers: {
        "Client-ID": clientId,
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        user_id: userId,
      },
    });

    if (response.data.data.length > 0) {
      const stream = response.data.data[0];
      console.log(`Channel ${channelName} is live: ${stream.title}`);
    } else {
      console.log(`Channel ${channelName} is not live`);
    }
  } catch (error) {
    console.error("Error checking if live:", error.message);
  }
}

async function startMonitoring() {
  try {
    await getAccessToken();
    const userId = await getUserId(channelName);
    console.log(
      `Monitoring channel ${channelName} (ID: ${userId}) for live status...`
    );

    setInterval(() => {
      checkIfLive(userId);
    }, 60000); // Check every minute
  } catch (error) {
    console.error("Error starting monitoring:", error.message);
  }
}

startMonitoring();
