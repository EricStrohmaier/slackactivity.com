// cronJobs.js

const cron = require("node-cron");

module.exports = {
  startCronJobs: () => {
    console.log("Starting cron jobs");
    // Define your cron jobs here
    cron.schedule("*/5 * * * *", async () => {
      console.log("Running a cron job every 5 minutes");
      const res = await fetch(
        "https://slacktivity.app/api/slack/schleude?secret=secret_token_007_007"
      );
      console.log("calling slacktivity", res.status);
    });
  },
};
