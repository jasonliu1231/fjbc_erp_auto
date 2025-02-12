import pool from "../../../lib/pgdb";
import { Expo } from "expo-server-sdk";

export default async function expoPushNotification(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { title, message, type } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const sql = `SELECT ARRAY_AGG(push_token) token_list FROM mobile_user WHERE type=ANY($1) AND push_token IS NOT NULL GROUP BY type`;
  const result = await pool.query(sql, [type]);
  const validTokens = result.rows;

  if (!validTokens) {
    return res.status(500).json({ success: false, error: "資料庫中無使用者！" });
  }

  try {
    for (const tokens of validTokens) {
      const tickets = await sendNotifications(tokens, title, message);
      console.log("推播完成:", tickets);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("推播失敗:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

async function sendNotifications(tokens, title, message) {
  console.log(tokens);
  const expo = new Expo();
  const messages = tokens.token_list
    .map((token) => {
      if (!Expo.isExpoPushToken(token)) {
        console.error(`推播 Token 無效: ${token}`);
        return null;
      }
      return { to: token, sound: "default", title, body: message };
    })
    .filter(Boolean);

  const chunks = expo.chunkPushNotifications(messages);
  const tickets = [];

  for (const chunk of chunks) {
    try {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      console.log("通知發送結果:", ticketChunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      console.error("通知發送失敗:", error);
    }
  }

  return tickets;
}
