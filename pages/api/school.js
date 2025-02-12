import pool from "/lib/pgdb";

export default async function handler(req, res) {
  try {
    let data = {};
    let result = await pool.query(`SELECT * FROM twcity`);
    data.city = result.rows;
    result = await pool.query(`SELECT * FROM twdist`);
    data.dist = result.rows;
    result = await pool.query(`SELECT * FROM twschool`);
    data.school = result.rows;

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json({ msg: "系統錯誤" });
  }
}
