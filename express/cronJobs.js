// cronJobs.js

const cron = require("node-cron");

module.exports = {
  startCronJobs: () => {
    console.log("Starting cron jobs");
    // Define your cron jobs here
    cron.schedule("*/5 * * * *", async () => {
      try {
        console.log("Running a cron job every 5 minutes");
        const res = await fetch(
          "http://localhost:3001/api/slack/schleude?secret=secret_token_007_007"
        );
        console.log("Calling slacktivity", res.status);
      } catch (error) {
        console.error("Error in cron job:", error);
      }
    }); //sdf
  },
};
