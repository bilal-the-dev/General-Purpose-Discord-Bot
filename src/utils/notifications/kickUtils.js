// kickUtils.js
const fs = require("fs").promises;
const path = require("path");
const puppeteer = require("puppeteer");

const notificationsFile = path.join(__dirname, "kick.json");

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

async function checkIfUserIsLive(username) {
  const url = `https://kick.com/${username}`;
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });
  const liveElement = await page.$(".avatar-holder .avatar-live-tag");

  let isLive = false;
  if (liveElement) {
    isLive = await page.evaluate((element) => {
      const style = window.getComputedStyle(element);
      return style.display === "block";
    }, liveElement);
  }

  await browser.close();
  return isLive;
}

module.exports = { loadNotifications, saveNotifications, checkIfUserIsLive };
