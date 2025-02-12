import pool from "/lib/pgdb";

export default async function handler(req, res) {
  const tutoring_id = req.query.id;
  const sql = `SELECT cl.course_no, c.course_name FROM askcourse_course_tutoring_link cl
                LEFT JOIN course c ON cl.course_no = c.course_no WHERE cl.tutoring_id = $1`;
  try {
    let result = await pool.query(sql, [tutoring_id]);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(400).json({ msg: "系統錯誤" });
  }
}
