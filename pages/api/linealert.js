import pool from "/lib/pgdb";
import axios from "axios";

export default async function LineAlert(req, res) {
  const item = req.body;
  const d = new Date();
  const date = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  let message = `繳費通知${item.other ? `(${item.other})` : ""}\n${item.tutoring_id == 1 ? "私立多易文理短期補習班" : item.tutoring_id == 2 ? "私立艾思短期補習班" : item.tutoring_name}\n學生：${
    item.student_name
  }\n實收金額：${item.amount}\n日期：${date}\n繳費方式：${item.payment_method == 1 ? "現金" : item.payment_method == 2 ? "轉帳" : item.payment_method == 3 ? "信用卡" : "其他"}`;
  try {
    await pool.query(`INSERT INTO notifications(type, type_detail, content) VALUES ($1, $2, $3);`, [2, "繳費送審", message]);
    await axios.post(
      "https://notify-api.line.me/api/notify",
      new URLSearchParams({
        message: message
      }),
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYMENT_TOKEN}`,
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    res.status(200).json({ msg: "Line 通知已發送" });
  } catch (error) {
    res.status(400).json({ msg: "發送 Line 通知時出錯" });
    console.error("發送 Line 通知時出錯:", error);
  }
}
