require("dotenv").config();
// Import required modules
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer"); // Import nodemailer for email functionality
const axios = require("axios");
const { Parser } = require("json2csv");
const cron = require("node-cron");
const moment = require("moment-timezone");
const botToken = process.env.BOT_TOKEN;
const CRchatId = process.env.CR_CHAT_ID; // Chat ID of the class representative
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;
const token = process.env.GITHUB_TOKEN;
const GitHubAPI1 = process.env.GITHUB_API1; // GitHub API URL
const GitHubAPI2 = process.env.GITHUB_API2;
const timezone = "Asia/Kolkata";
const chatIds = [5928914069, 6562925416]; // List of student chat IDs
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const serverUrl = "https://01su22ai079.glitch.me/ping";

// Create an instance of the Express application
const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 3000;

const pingServer = async () => {
  let now = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  try {
    // Send a ping request to the server
    await axios.get(serverUrl); // Replace with the actual server URL
    console.log("Ping sent to Server at:", now);

    // Prepare the data to be appended
    const newData = `Success,${now}`;

    // Get the current content of the file from GitHub
    const response = await axios.get(GitHubAPI1, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    const fileContent = response.data.content;
    const fileSha = response.data.sha; // The current sha of the file

    // Decode the base64 file content
    const decodedContent = Buffer.from(fileContent, "base64").toString("utf8");

    // Append new data to the file
    const updatedContent = decodedContent + "\n" + newData;

    // Encode the updated content to base64
    const base64UpdatedContent = Buffer.from(updatedContent).toString("base64");

    // Create the request body for the GitHub API
    const updateData = {
      message: "Update `sentPing`.csv with ping information",
      content: base64UpdatedContent,
      sha: fileSha, // This is required for updating the file
    };

    // Update the file on GitHub via PUT request
    await axios.put(GitHubAPI1, updateData, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    console.log("Ping data appended successfully to sentPing.csv on GitHub");
  } catch (error) {
    console.error("Error pinging Server:", error.message);
    console.error("Error appending data to CSV:", error);
  }
};

cron.schedule("0 * * * * *", pingServer);

// Email configuration (Make sure to set up your email and password correctly)
const transporter = nodemailer.createTransport({
  service: "gmail", // Use your email service
  auth: {
    user: emailUser, // Your email
    pass: emailPass, // Your email password
  },
});

// Function to send a message to Telegram
const sendTelegramMessage = async (chatId, message) => {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  try {
    await axios.post(url, {
      chat_id: chatId, // Send message to the specified chatId
      text: message,
      parse_mode: "HTML",
    });
    console.log(`Message sent to chat ID: ${chatId}`);
  } catch (error) {
    console.error("Error sending message to Telegram:", error);
  }
};

// Class schedule data
const classDurations = {
  1: [
    { start: "09:00", end: "09:55", subject: "Operating Systems" },
    { start: "09:55", end: "10:50", subject: "Computer Networks" },
    { start: "11:05", end: "12:00", subject: "Introduction to Data Science" },
    {
      start: "12:00",
      end: "12:55",
      subject: "Design and Analysis of Algorithm",
    },
    { start: "13:40", end: "14:35", subject: "Operating Systems" },
  ],
  2: [
    {
      start: "09:00",
      end: "10:50",
      subject: "Introduction to Artificial Neural Networks",
    },
    {
      start: "11:05",
      end: "12:55",
      subject: "Computer Networks Lab (Batch-1)",
    },
  ],
  3: [
    { start: "09:00", end: "09:55", subject: "Operating Systems" },
    { start: "09:55", end: "10:50", subject: "Library Hour" },
    {
      start: "11:05",
      end: "12:00",
      subject: "Design and Analysis of Algorithm",
    },
    { start: "12:00", end: "12:55", subject: "Free Hour" },
    {
      start: "13:40",
      end: "15:35",
      subject:
        "Design and Analysis of Algorithm Lab (Batch-1) / Operating Systems Lab (Batch-2)",
    },
  ],
  4: [
    {
      start: "09:00",
      end: "10:50",
      subject: "Design and Analysis of Algorithm",
    },
    { start: "11:05", end: "12:55", subject: "Computer Networks" },
    {
      start: "13:40",
      end: "15:35",
      subject: "Computer Networks Lab (Batch-2)",
    },
  ],
  5: [
    { start: "09:00", end: "09:55", subject: "Computer Networks" },
    { start: "09:55", end: "10:50", subject: "Introduction to Data Science" },
    {
      start: "11:05",
      end: "12:55",
      subject:
        "Operating Systems Lab (Batch-1) / Design and Analysis of Algorithm Lab (Batch-2)",
    },
    {
      start: "13:40",
      end: "15:35",
      subject: "Introduction to Artificial Neural Networks",
    },
  ],
  6: [
    { start: "09:00", end: "09:55", subject: "Introduction to Data Science" },
    { start: "09:55", end: "10:50", subject: "Free Hour" },
    {
      start: "11:05",
      end: "12:00",
      subject: "Introduction to Artificial Neural Networks",
    },
    { start: "12:00", end: "12:55", subject: "Operating Systems" },
  ],
};

// Function to format the schedule for a specific day
const formatSchedule = (day) => {
  const schedule = classDurations[day];
  if (!schedule) return "No classes scheduled for today.";

  let message = `⏰ <b>Today's Schedule</b>:\n\n`; // Title for the schedule

  schedule.forEach((classDetail, index) => {
    message += `<b>Class ${index + 1}:</b> \n`; // Added sparkle emoji
    message += `<b>Subject:</b> ${classDetail.subject}\n`; // Added graduation cap emoji
    message += `<b>Time:</b> ${classDetail.start} - ${classDetail.end}\n\n`; // Added clock emoji
  });

  return message;
};
// Function to send the daily schedule to all users
const sendDailySchedule = () => {
  let now = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  let date = new Date(now);
  let Day = date.getDay();
  const message = formatSchedule(Day); // Format the schedule for the current day
  // Send the daily schedule to all user chat IDs
  chatIds.forEach((chatId) => {
    sendTelegramMessage(chatId, message); // Send message to each student
  });
};

// Schedule the cron job to run at 8:00 AM every weekday (Monday to Saturday)
cron.schedule(
  "30 6 * * 1-6",
  () => {
    sendDailySchedule();
    console.log("Daily schedule sent to all users at 6:30 AM IST.");
  },
  {
    scheduled: true,
    timezone: timezone,
  }
);

const appendPingDataToCSV = async (newData) => {
  try {
    // Fetch the current content of the file from GitHub
    const response = await axios.get(GitHubAPI2, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    const fileContent = response.data.content;
    const fileSha = response.data.sha; // The current sha of the file

    // Decode the base64 file content
    const decodedContent = Buffer.from(fileContent, "base64").toString("utf8");

    // Append new data to the file
    const updatedContent = decodedContent + "\n" + newData;

    // Encode the updated content to base64
    const base64UpdatedContent = Buffer.from(updatedContent).toString("base64");

    // Create the request body for the GitHub API
    const updateData = {
      message: "Update recievedPing.csv with ping information",
      content: base64UpdatedContent,
      sha: fileSha, // This is required for updating the file
    };

    // Update the file on GitHub via PUT request
    await axios.put(GitHubAPI2, updateData, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    console.log(
      "Ping data appended successfully to recievedPing.csv on GitHub"
    );
  } catch (error) {
    console.error("Error appending data to CSV:", error.message);
  }
};

app.get("/ping", async (req, res) => {
      let now = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  console.log("Ping received at", now);

  // Prepare the data to append to the CSV
  const newData = `Success,${now}`;

  // Append the data to the CSV file on GitHub
  await appendPingDataToCSV(newData);

  // Send response to the client
  res.send("Server is awake");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
