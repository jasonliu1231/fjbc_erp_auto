import pool from "../../../lib/pgdb";

export default async function handler(req, res) {
  switch (req.method) {
    case "GET":
      try {
        const sql = `
                SELECT "user".id user_id, first_name, nick_name, tel, username FROM "user" 
                INNER JOIN user_role_link ON user_role_link.user_id = "user".id
                WHERE is_active = true AND role_id IN (1,2,4,7)
            `;
        const result = await pool.query(sql);
        res.status(200).json(result.rows);
      } catch (error) {
        console.log(error);
        res.status(400).json({ msg: "讀取錯誤！" });
      }
    case "POST":
      const user_id = req.body.user_id;
      try {
        const sql = `INSERT INTO mobile_user(user_id) VALUES ($1) RETURNING id`;
        const result = await pool.query(sql, [user_id]);
        res.status(200).json({ mobile_id: result.rows[0].id });
      } catch (error) {
        console.log(error);
        res.status(400).json({ msg: "讀取錯誤！" });
      }
    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
