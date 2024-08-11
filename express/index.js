const express = require("express");
const cronJobs = require("./cronJobs"); // Assuming your cron jobs module is in a file named cronJobs.js

const app = express();
const PORT = 8000;

// Define your routes
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/about", (req, res) => {
  res.send("About route 🎉 ");
});

// Start your Express server
const server = app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});

// Start your cron jobs
cronJobs.startCronJobs();

// Handle server errors
server.on("error", (err) => {
  console.error("Server error:", err);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
