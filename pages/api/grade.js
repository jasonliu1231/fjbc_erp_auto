import pool from "/lib/pgdb";

export default async function handler(req, res) {
  try {
    let result = await pool.query(`SELECT id, grade_name FROM twgrade`);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(400).json({ msg: "系統錯誤" });
  }
}
