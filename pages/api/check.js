import pool from "../../lib/pgdb";

export async function getUser(user_id) {
  try {
    let result = await pool.query(`SELECT first_name, nick_name FROM "user" WHERE id=$1`, [user_id]);
    const user_name = result.rows[0];
    return user_name;
  } catch (error) {
    console.log(error);
  }
}

export async function checkPerm(id, uuid) {
  const sql = `SELECT * FROM user_perm_link upl
            LEFT JOIN perm p ON p.id = upl.perm_id
            LEFT JOIN perm_detail pd ON p.id = pd.perm_id
            WHERE upl.user_id=$1 AND p.enable=true AND (pd.uuid=$2 OR p.type=0)`;
  try {
    const result = await pool.query(sql, [id, uuid]);
    if (result.rows.length > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
}
