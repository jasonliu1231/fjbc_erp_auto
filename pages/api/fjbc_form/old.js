import pool from "../../../lib/fjbc_activity";
import axios from "axios";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      const gid = req.query.id;
      let resultData;
      try {
        let result = await pool.query(`SELECT name, textarea, schooltype, schoolcontent, gradetype, gradecontent, banner, date, enddate, enable FROM questionnaire WHERE id=$1`, [gid]);
        if (!result.rows[0].enable) {
          res.status(400).json({ msg: "活動已關閉" });
          return;
        }
        resultData = result.rows[0];
        result = await pool.query(`SELECT index, title, type, content FROM questionnaireentity WHERE questionnaireid=$1 ORDER BY index`, [gid]);
        resultData.customize = result.rows;

        res.status(200).json(resultData);
      } catch (error) {
        console.log(error);
        res.status(400).json({ msg: "表單讀取錯誤，請重新取得活動連結！" });
      }
      break;

    case "POST":
      const body = req.body;
      let params = [];
      let sqlitems = [];
      let sqlindex = [];
      const items = Object.keys(body);
      items.forEach((item, index) => {
        if (item != "id") {
          sqlitems.push(item);
          sqlindex.push(`$${index + 1}`);
          params.push(body[item]);
        }
      });

      // 取得表單資料
      let result = await pool.query(`SELECT name FROM questionnaire WHERE id=$1`, [body.id]);
      const title = result.rows[0].name;

      try {
        result = await pool.query(`SELECT * FROM result${body.id} WHERE student=$1 AND tel=$2`, [body.student, body.tel]);
        if (result.rows.length != 0) {
          res.status(400).json({ msg: "此學生姓名與電話已經存在，如有問題請來電補習班！" });
          return;
        }
        let sql = `INSERT INTO result${body.id}(${sqlitems.join(",")}) VALUES (${sqlindex.join(",")});`;
        await pool.query(sql, params);
        let message = `有一張新活動表單\n${title}\n學生姓名：${body.student}\nhttp://172.16.150.27:3200/admin/activity`;
        LineAlert(message);
        res.status(200).json({});
      } catch (error) {
        console.log(error);
        if (error.code == 23505) {
          res.status(400).json({ msg: "資料重複，請確認唯一欄位！" });
        } else {
          res.status(400).json({ msg: "系統錯誤" });
        }
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}

async function LineAlert(message) {
  try {
    await axios.post(
      "https://notify-api.line.me/api/notify",
      new URLSearchParams({
        message: message
      }),
      {
        headers: {
          Authorization: `Bearer zNfwpNjl2jY7bEcf69Ul0IYsEGC8TWHPTUe0s3O0YJ0`,
          // Authorization: `Bearer NBzg4g0lLa3kV1kt6XvEGmIRdkK8aOdwY8hTbaI6K99`,
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );
    console.log("Line 通知已發送");
  } catch (error) {
    console.error("發送 Line 通知時出錯:", error);
  }
}
