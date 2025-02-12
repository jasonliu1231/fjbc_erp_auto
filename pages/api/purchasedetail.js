import pool from "../../lib/pgdb";
import { checkPerm } from "./check";

export default async function handler(req, res) {
  const user_id = req.headers.user_id;
  let check = true;
  const { user, type, item, name, groupid, productid, quantity, price, tutoringid, detailid } = req.body;
  switch (req.method) {
    case "GET":
      check = await checkPerm(user_id, "f7dbe62a-da74-04f8-1252-9ff9cbe18955");
      if (!check) {
        res.status(425).json({ detail: "權限不足" });
        return;
      }
      const id = req.query.id;
      try {
        let data = {};
        await pool.query("BEGIN");
        let result = await pool.query(`SELECT * FROM purchase WHERE id=$1`, [id]);
        data.entity = result.rows[0];
        result = await pool.query(`SELECT * FROM purchasedetail WHERE purchaseid=$1 AND disabled=$2 ORDER BY id`, [id, false]);
        data.detail = result.rows;
        await pool.query("COMMIT");
        res.status(200).json(data);
      } catch (error) {
        res.status(400).json({ msg: "系統錯誤" });
      }
      break;

    // 商品入庫，並修改數量餘額--只需要入庫權限
    case "POST":
      if (tutoringid == 4) {
        check = await checkPerm(user_id, "33bd6db1-87e8-851d-0690-a035ca108923");
      } else {
        check = await checkPerm(user_id, "3f84ee37-628a-cf66-ad64-450e42229249");
      }
      if (!check) {
        res.status(425).json({ detail: "權限不足" });
        return;
      }

      try {
        let params = [productid, true, quantity, quantity * price, tutoringid, user];
        await pool.query("BEGIN");
        if (type == 1) {
          // 代表存入現有的商品入庫
          await pool.query(`INSERT INTO productdetail(productid, state, quantity, money, tutoringid, createby, createdate)	VALUES ($1, $2, $3, $4, $5, $6, now())`, params);
          await pool.query(`UPDATE purchasedetail SET remainder=remainder-$1 WHERE id = $2`, [quantity, detailid]);
        } else if (type == 2) {
          // 代表建立新商品入庫
          let result = await pool.query(`INSERT INTO product(groupid, name, price)	VALUES ($1, $2, $3) RETURNING id`, [groupid, name, price]);
          params = [result.rows[0].id, true, quantity, quantity * price, tutoringid, user];
          await pool.query(`INSERT INTO productdetail(productid, state, quantity, money, tutoringid, createby, createdate)	VALUES ($1, $2, $3, $4, $5, $6, now())`, params);
          await pool.query(`UPDATE purchasedetail SET remainder=remainder-$1 WHERE id = $2`, [quantity, detailid]);
        }
        await pool.query("COMMIT");
        res.status(200).json({});
      } catch (error) {
        res.status(400).json({ msg: "系統錯誤" });
      }
      break;

    case "PUT":
      check = await checkPerm(user_id, "97f3b45f-9ed3-6b40-769f-a318e0da4d5e");
      if (!check) {
        res.status(425).json({ detail: "權限不足" });
        return;
      }

      try {
        let sql = "";
        let params = [];
        if (type == 1) {
          sql = `UPDATE purchasedetail SET name=$1, quantity=$2, unit=$3, specification=$4, price=$5, updataby=$6, updatedon=now(), remark=$7 WHERE id=$8`;
          params = [item.name, item.quantity, item.unit, item.specification, item.price, user, item.remark, item.id];
        } else if (type == 2) {
          sql = `UPDATE purchasedetail SET disabled=$1, updataby=$2, updatedon=now() WHERE id=$3`;
          params = [true, user, item.id];
        }
        await pool.query(sql, params);
        res.status(200).json({ id: item.purchaseid });
      } catch (error) {
        console.log(error);
        res.status(400).json({ msg: "系統錯誤" });
      }
      break;

    // case "DELETE":
    //   try {
    //     let result = await pool.query("DELETE FROM perm WHERE id = $1", [id]);
    //     res.status(200).json(result.rows);
    //   } catch (error) {
    //     res.status(500).json({ error: "Failed to delete product" });
    //   }
    //   break;

    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
