import TelegramBot from "node-telegram-bot-api";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

/* ------------------ TELEGRAM BOT ------------------ */
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

/* ------------------ GOOGLE AUTH ------------------ */
const auth = new google.auth.GoogleAuth({
  keyFile: "credentials.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const sheets = google.sheets({
  version: "v4",
  auth,
});

/* ------------------ SHEET CONFIG ------------------ */
const SHEET_ID = "1nM60j3Bv1EuF1pSU5x4XUjaBGKmNvTDEhLCbS5KH4uU";
const SHEET_NAME = "Sheet1"; // must match exactly

/* ------------------ /info COMMAND ------------------ */
bot.onText(/\/info/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A2:C`,
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return bot.sendMessage(chatId, "⚠️ No data found in the sheet.");
    }

    let reply = "📋 *User Information List*\n\n";

    rows.forEach((row, index) => {
      reply += `${index + 1}.\n`;
      reply += `👤 Name: ${row[0] || "N/A"}\n`;
      reply += `📧 Email: ${row[1] || "N/A"}\n`;
      reply += `🛡 Role: ${row[2] || "N/A"}\n\n`;
    });

    bot.sendMessage(chatId, reply, { parse_mode: "Markdown" });

  } catch (error) {
    console.error("Google Sheets Error:", error.message);
    bot.sendMessage(chatId, "❌ Failed to fetch info");
  }
});

/* ------------------ BOT START LOG ------------------ */
console.log("🤖 Telegram bot is running...");
