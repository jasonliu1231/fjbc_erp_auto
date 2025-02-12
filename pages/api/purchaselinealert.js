import axios from "axios";

export default async function handler(req, res) {
  const message = req.body.message;
  try {
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
