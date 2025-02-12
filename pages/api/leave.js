import pool from "../../lib/pgdb";
import { Expo } from "expo-server-sdk";

export default async function expoPushNotification(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { schedule_id, schedule_date, schedule_name, c_name, e_name, leave_end_time, leave_start_time, leave_reason } = req.body;

  const user_sql = `
    SELECT ARRAY_AGG(DISTINCT user_id) user_id FROM tutoring_course_schedule_teacher
    INNER JOIN teacher ON teacher.id = tutoring_course_schedule_teacher.teacher_id
    WHERE tutoring_course_schedule_teacher.schedule_id=$1
    `;
  const user_result = await pool.query(user_sql, [schedule_id]);

  const token_sql = `
    SELECT ARRAY_AGG(DISTINCT push_token) token_list 
    FROM mobile_user WHERE user_id=ANY($1) AND push_token IS NOT NULL
    GROUP BY type`;
  const token_result = await pool.query(token_sql, [user_result.rows[0].user_id]);
  const validTokens = token_result.rows;

  if (!validTokens) {
    return res.status(500).json({ success: false, error: "資料庫中無使用者！" });
  }

  const title = `學生請假提醒！`;
  const message = `${schedule_date} ⭐︎ ${schedule_name}\n學生：${c_name}\n請假原因：${leave_reason}`;

  const notification_sql = `INSERT INTO notifications(type, type_detail, content, user_ids) VALUES (10, $1, $2, $3)`;
  await pool.query(notification_sql, [title, message, user_result.rows[0].user_id]);

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
