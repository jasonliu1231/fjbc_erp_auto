import pool from "/lib/pgdb";
import { checkPerm } from "./check";

export default async function handler(req, res) {
  const user_id = req.headers.user_id;
  let check = true;
  switch (req.method) {
    // 學生性向紀錄查詢
    case "GET":
      check = await checkPerm(user_id, "97c92147-981c-7a6c-3390-3d63b193b863");
      if (!check) {
        res.status(425).json({ detail: "權限不足" });
        return;
      }
      const id = req.query.id;
      let result = await pool.query(`SELECT * FROM preparationdetail WHERE student_id=$1`, [id]);
      res.status(200).json(result.rows);
      break;
    // 學生性向紀錄修改
    case "PUT":
      check = await checkPerm(user_id, "b37e6b40-f279-e15a-a293-590b944417f0");
      if (!check) {
        res.status(425).json({ detail: "權限不足" });
        return;
      }
      const { uid, select } = req.body;
      await pool.query("BEGIN");
      await pool.query(`DELETE FROM preparationdetail WHERE student_id=$1`, [uid]);
      for (let item of select) {
        let sql = `INSERT INTO preparationdetail(student_id, selectid)VALUES ($1, $2);`;
        let params = [uid, item];
        await pool.query(sql, params);
      }
      await pool.query("COMMIT");
      res.status(200).json({ id: uid });
      break;
    // 學生性向紀錄新增
    case "POST":
      check = await checkPerm(user_id, "6de90ff8-839f-3fe6-d641-9cd509440aed");
      if (!check) {
        res.status(425).json({ detail: "權限不足" });
        return;
      }
      try {
        const { uid, select } = req.body;
        await pool.query("BEGIN");
        for (let item of select) {
          let sql = `INSERT INTO preparationdetail(student_id, selectid)VALUES ($1, $2);`;
          let params = [uid, item];
          await pool.query(sql, params);
        }
        await pool.query("COMMIT");
        res.status(200).json({ id: uid });
      } catch (error) {
        console.log(error);
        res.status(400).json({ msg: "系統錯誤" });
      }
      break;
  }
}
