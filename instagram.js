const puppeteer = require("puppeteer");
const cron = require("node-cron");

let browser;
let page;
let lastPostUrl = "";

async function initializeBrowser(username, password) {
  browser = await puppeteer.launch({ headless: false });
  page = await browser.newPage();

  try {
    // Login process
    await page.goto("https://www.instagram.com/accounts/login/", {
      waitUntil: "networkidle0",
    });
    await page.waitForSelector('input[name="username"]');
    await page.type('input[name="username"]', username);
    await page.type('input[name="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: "networkidle0" });
    console.log("Login successful");
  } catch (error) {
    console.error("Error during login:", error);
    await browser.close();
    process.exit(1);
  }
}

async function checkForNewPosts(profileUrl) {
  try {
    await page.goto(profileUrl, { waitUntil: "networkidle0" });
    console.log("Checking profile for new posts...");

    await page.waitForSelector("._ac7v.xras4av.xgc1b0m.xat24cr.xzboxd6");

    const firstPostUrl = await page.evaluate(() => {
      const postContainer = document.querySelector(
        "._ac7v.xras4av.xgc1b0m.xat24cr.xzboxd6"
      );
      if (!postContainer) return null;

      const firstLink = postContainer.querySelector("a");
      return firstLink ? firstLink.href : null;
    });

    if (firstPostUrl && firstPostUrl !== lastPostUrl) {
      console.log("New post detected!");
      console.log(`User just posted a new photo: ${firstPostUrl}`);
      // Here you can add code to send a notification, e.g., via email or a messaging service

      lastPostUrl = firstPostUrl;
    } else {
      console.log("No new posts found");
    }
  } catch (error) {
    console.error("An error occurred while checking for new posts:", error);
  }
}

async function startMonitoring(username, password, profileUrl) {
  await initializeBrowser(username, password);

  // Initial check
  await checkForNewPosts(profileUrl);

  // Schedule checks every 5 minutes
  cron.schedule("*/1 * * * *", async () => {
    await checkForNewPosts(profileUrl);
  });
}

// Replace with your Instagram credentials
const username = "ahsan_fr1";
const password = "ahsanfarooq786";
const profileUrl = "https://www.instagram.com/ahsan_fr1/";

startMonitoring(username, password, profileUrl);
