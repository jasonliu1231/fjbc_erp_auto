import pool from "/lib/pgdb";

export default async function handler(req, res) {
  const sql = `SELECT id, info_name FROM askcourse_infosource WHERE is_active=true;`;
  try {
    let result = await pool.query(sql);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(400).json({ msg: "系統錯誤" });
  }
}
