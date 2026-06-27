import TelegramBot from "node-telegram-bot-api";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

// Telegram bot
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// Google Auth
const auth = new google.auth.GoogleAuth({
  keyFile: "credentials.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const sheets = google.sheets({ version: "v4", auth });

// Replace with your Sheet ID
const SHEET_ID = "1nM60j3Bv1EuF1pSU5x4XUjaBGKmNvTDEhLCbS5KH4uU";

// /info command
bot.onText(/\/info/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "Sheet1!A2:C2",
    });

    const row = response.data.values[0];

    const reply = `
👤 Name: ${row[0]}
📧 Email: ${row[1]}
🛡 Role: ${row[2]}
    `;

    bot.sendMessage(chatId, reply);
  } catch (error) {
    bot.sendMessage(chatId, "❌ Failed to fetch info");
  }
});