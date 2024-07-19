// twitchUtils.js
const fs = require("fs").promises;
const path = require("path");
const axios = require("axios");

const notificationsFile = path.join(__dirname, "twitchNotifications.json");
const clientId = process.env.TWITCH_CLIENTID;
const clientSecret = process.env.TWITCH_CLIENTSECRET;
let accessToken = "";


console.log({clientId,clientSecret});
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
    throw error;
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

    return (
      response.data.data.length > 0 && response.data.data[0].type === "live"
    );
  } catch (error) {
    console.error("Error checking if live:", error.message);
    return false;
  }
}

module.exports = {
  loadNotifications,
  saveNotifications,
  getAccessToken,
  getUserId,
  checkIfLive,
};
