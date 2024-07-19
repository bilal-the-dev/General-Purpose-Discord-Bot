const puppeteer = require("puppeteer");

async function monitorNewTweets(url) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  let knownTweets = new Set();

  const getLatestTweets = async () => {
    // Wait for tweets to load
    await page.waitForSelector("article div[lang]");

    // Extract the latest tweets
    const newTweets = await page.evaluate(() => {
      const tweetElements = document.querySelectorAll("article div[lang]");
      let tweets = [];
      tweetElements.forEach((tweetElement) => {
        tweets.push(tweetElement.innerText);
      });
      return tweets;
    });

    // Check for and log new tweets
    newTweets.forEach((tweet) => {
      if (!knownTweets.has(tweet)) {
        console.log("New tweet:", tweet);
        knownTweets.add(tweet);
      }
    });
  };

  // Run the function once initially
  await getLatestTweets();

  // Set up an interval to check for new tweets every second
  setInterval(async () => {
    await page.reload({ waitUntil: "networkidle2" });
    await getLatestTweets();
  }, 60000);
}

monitorNewTweets("https://x.com/learnKnowlegde").catch((error) => {
  console.error("Error:", error);
});
