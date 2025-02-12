import pool from "/lib/pgdb";
import { checkPerm, getUser } from "./check";
import axios from "axios";

export default async function handler(req, res) {
  const user_id = req.headers.user_id;
  let check = true;
  let sql = ``;
  switch (req.method) {
    case "GET":
      check = await checkPerm(user_id, "f7dbe62a-da74-04f8-1252-9ff9cbe18955");
      if (!check) {
        res.status(425).json({ detail: "權限不足" });
        return;
      }
      let order_type = req.query.type;
      let index = false;
      if (order_type) {
        index = JSON.parse(req.query.index);
      }
      sql = `SELECT * FROM purchase WHERE (firstchecked != false OR firstchecked IS NULL) AND (lastchecked != false OR lastchecked IS NULL) ORDER BY`;
      if (order_type == 1) {
        sql += ` createby`;
        if (index) {
          sql += ` DESC`;
        }
      } else if (order_type == 2) {
        sql += ` createdon`;
        if (index) {
          sql += ` DESC`;
        }
      } else if (order_type == 3) {
        sql += ` tutoringid`;
        if (index) {
          sql += ` DESC`;
        }
      } else if (order_type == 4) {
        sql += ` class`;
        if (index) {
          sql += ` DESC`;
        }
      } else if (order_type == 5) {
        sql += ` reason`;
        if (index) {
          sql += ` DESC`;
        }
      } else if (order_type == 6) {
        sql += ` deadline`;
        if (index) {
          sql += ` DESC`;
        }
      } else if (order_type == 7) {
        sql += ` CASE WHEN amount IS NULL THEN 1 ELSE 0 END, amount`;
        if (index) {
          sql += ` DESC`;
        }
      } else {
        sql += ` id DESC`;
      }
      try {
        const result = await pool.query(sql);
        res.status(200).json(result.rows);
      } catch (error) {
        res.status(400).json({ msg: "系統錯誤" });
      }
      break;

    case "PUT":
      const { type, purchaseid, checked, user, discount, transportation, remark, amount } = req.body;
      let params = [];
      if (type == 1) {
        check = await checkPerm(user_id, "a00a71e6-8a3c-ad8a-b70a-a5d2915466d4");
        sql = `UPDATE purchase SET firstchecked=$1, firstby=$2, firstdon=now() WHERE id=$3`;
        params = [checked, user, purchaseid];
      } else if (type == 2) {
        check = await checkPerm(user_id, "97f3b45f-9ed3-6b40-769f-a318e0da4d5e");
        sql = `UPDATE purchase SET secondchecked=$1, secondby=$2, transportation=$3, amount=$5, seconddon=now() WHERE id=$4`;
        params = [checked, user, transportation, purchaseid, amount];
      } else if (type == 3) {
        check = await checkPerm(user_id, "e2e74a00-a96b-8128-990c-b22718b31ad0");
        sql = `UPDATE purchase SET lastchecked=$1, lastby=$2, lastdon=now() WHERE id=$3`;
        params = [checked, user, purchaseid];
      } else if (type == 4) {
        check = await checkPerm(user_id, "1429287a-ba43-252b-9953-9f3a87071f2f");
        sql = `UPDATE purchase SET closeby=$1, discount=$2, amount=amount-$2, remark=$3, closedon=now() WHERE id=$4`;
        params = [user, discount, remark, purchaseid];
      }
      if (!check) {
        res.status(425).json({ detail: "權限不足" });
        return;
      }
      try {
        await pool.query(sql, params);
        if (type == 2) {
          LineAlert(`\n有一筆採購單已報價\n請複審！`, process.env.PURCHASE_CHECKED_TOKEN);
        }
        res.status(200).json({ id: purchaseid });
      } catch (error) {
        console.log(error);
        res.status(400).json({ msg: "系統錯誤" });
      }
      break;

    case "POST":
      const userInfo = await getUser(user_id);
      const createby = userInfo.first_name;
      try {
        const { tutoringid, className, deadline, reason, products } = req.body;
        let params = [tutoringid, className, deadline, createby, reason, user_id];
        // 傳送文字
        const d = new Date(deadline);
        const date = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
        let message = `\n有一張新的採購單申請\n申請單位：${tutoringid == 1 ? "多易" : tutoringid == 2 ? "艾思" : "華而敦"}\n申請人：${createby}\n需求日期：${date}\n明細：\n`;
        products.forEach((element, index) => {
          if (index < 2) {
            message += `${element.name} x${element.quantity}${element.unit}\n`;
          } else if (index == 2) {
            message += "....";
          }
        });
        await pool.query("BEGIN");
        let result = await pool.query(`INSERT INTO purchase(tutoringid, class, deadline, createby, createdon, reason, create_id) VALUES ($1, $2, $3, $4, now(), $5, $6) RETURNING id;`, params);
        for (let item of products) {
          params = [result.rows[0].id, item.name, item.quantity, item.unit, item.specification, item.price, item.remark];
          await pool.query(`INSERT INTO purchasedetail(purchaseid, name, quantity, remainder, unit, specification, price, remark) VALUES ($1, $2, $3, $3, $4, $5, $6, $7);`, params);
        }
        await pool.query(`INSERT INTO notifications(type, type_detail, content) VALUES ($1, $2, $3);`, [1, "初審", message]);
        await pool.query("COMMIT");
        LineAlert(message, process.env.PURCHASE_NEW_CHECKED_TOKEN);
        res.status(200).json([]);
      } catch (error) {
        console.log(error);
        res.status(400).json({ msg: "系統錯誤，請重新嘗試，如一直無法送出請聯繫資訊部門！" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "PUT", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}

async function LineAlert(message, token) {
  try {
    await axios.post(
      "https://notify-api.line.me/api/notify",
      new URLSearchParams({
        message: message
      }),
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );
    res.status(200).json({ msg: "Line 通知已發送" });
  } catch (error) {
    console.error("發送 Line 通知時出錯:", error);
    res.status(400).json({ msg: "發送 Line 通知時出錯" });
  }
}
