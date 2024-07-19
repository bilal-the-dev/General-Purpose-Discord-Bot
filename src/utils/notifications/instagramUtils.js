// instagramUtils.js
const fs = require("fs").promises;
const path = require("path");
const puppeteer = require("puppeteer");

const notificationsFile = path.join(__dirname, "instagramNotifications.json");

let browser;
let page;

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

async function initializeBrowser(username, password) {
  browser = await puppeteer.launch({ headless: true , args: ['--no-sandbox']});
  page = await browser.newPage();

  try {
    await page.goto("https://www.instagram.com/accounts/login/", {
      waitUntil: "networkidle0",
    });
    await page.waitForSelector('input[name="username"]');
    await page.type('input[name="username"]', username);
    await page.type('input[name="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: "networkidle0" });
    console.log("Instagram login successful");
  } catch (error) {
    console.error("Error during Instagram login:", error);
    await browser.close();
    process.exit(1);
  }
}

async function checkForNewPosts(profileUrl) {
  try {
    await page.goto(profileUrl, { waitUntil: "networkidle0" });
    await page.waitForSelector("._ac7v.xras4av.xgc1b0m.xat24cr.xzboxd6");

    const firstPostUrl = await page.evaluate(() => {
      const postContainer = document.querySelector(
        "._ac7v.xras4av.xgc1b0m.xat24cr.xzboxd6"
      );
      if (!postContainer) return null;

      const firstLink = postContainer.querySelector("a");
      return firstLink ? firstLink.href : null;
    });

    return firstPostUrl;
  } catch (error) {
    console.error("An error occurred while checking for new posts:", error);
    return null;
  }
}

module.exports = {
  loadNotifications,
  saveNotifications,
  initializeBrowser,
  checkForNewPosts,
};
