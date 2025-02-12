import pool from "../../lib/pgdb";
import { checkPerm } from "./check";

export default async function handler(req, res) {
  const { id, equipment_name, equipment_ip, check } = req.body;
  switch (req.method) {
    case "GET":
      try {
        const sql = `SELECT id, created_at, updated_at, equipment_name, equipment_ip FROM equipment`;
        const result = await pool.query(sql);
        res.status(200).json(result.rows);
      } catch (error) {
        res.status(400).json({ msg: "系統錯誤" });
      }
      break;

    case "POST":
      try {
        let sql = `SELECT 1 FROM equipment WHERE equipment_name = $1 OR equipment_ip = $2`;
        let params = [equipment_name, equipment_ip];
        if (check) {
          let result = await pool.query(sql, params);
          if (result.rows.length > 0) {
            res.status(400).json({
              msg: "名稱或 ip 位置有重複，請確認！"
            });
            return;
          }
        }

        sql = `INSERT INTO equipment(equipment_name, equipment_ip) VALUES ($1, $2)`;
        params = [equipment_name, equipment_ip];
        await pool.query(sql, params);
        res.status(200).json(null);
      } catch (error) {
        console.log(error);
        res.status(400).json({ msg: "系統錯誤" });
      }
      break;

    case "PUT":
      try {
        let sql = `SELECT 1 FROM equipment WHERE id = $1`;
        let params = [id];
        let result = await pool.query(sql, params);
        if (result.rows.length == 0) {
          res.status(400).json({
            msg: "此筆資料已不存在，請重新整理畫面！"
          });
          return;
        }

        sql = `SELECT 1 FROM equipment WHERE equipment_name = $1 OR equipment_ip = $2`;
        params = [equipment_name, equipment_ip];
        if (check) {
          let result = await pool.query(sql, params);
          if (result.rows.length > 0) {
            res.status(400).json({
              msg: "名稱或 ip 位置有重複，請確認！"
            });
            return;
          }
        }

        sql = `UPDATE equipment SET equipment_name=$1, equipment_ip=$2, updated_at=now() WHERE id=$3`;
        params = [equipment_name, equipment_ip, id];
        await pool.query(sql, params);
        res.status(200).json(null);
      } catch (error) {
        console.log(error);
        res.status(400).json({ msg: "系統錯誤" });
      }
      break;

    case "DELETE":
      try {
        let sql = `SELECT 1 FROM equipment WHERE id = $1`;
        let params = [id];
        let result = await pool.query(sql, params);
        if (result.rows.length == 0) {
          res.status(400).json({
            msg: "此筆資料已不存在，請重新整理畫面！"
          });
          return;
        }

        await pool.query("DELETE FROM equipment WHERE id = $1", [id]);
        res.status(200).json(null);
      } catch (error) {
        res.status(400).json({ msg: "系統錯誤" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
