import pool from "../../lib/pgdb";

export default async function handler(req, res) {
  try {
    const { teacher, student, start, end, start_time, end_time } = req.body;
    const data = {};
    let sql = "";
    let params = [];
    let result = {};

    await pool.query("BEGIN");
    // 教師列表
    if (teacher.length == 0) {
      data.teacher = [];
    } else {
      sql = `SELECT tcs.course_name, tcs.classroom_name, tcs.course_date, tcs.start_time, tcs.end_time, u.first_name c_name, u.nick_name 
            FROM tutoring_course_schedule tcs
            INNER JOIN tutoring_course_schedule_teacher tcst ON tcs.id = tcst.schedule_id
            INNER JOIN teacher t ON t.id = tcst.teacher_id
            INNER JOIN "user" u ON u.id = t.user_id
            WHERE (tcs.course_date >= $1 AND tcs.course_date <= $2)`;
      params = [start, end];
      // 時間區間
      if (start_time && end_time) {
        sql += ` AND ((start_time <= $3 AND end_time >= $3) OR (start_time <= $4 AND end_time >= $4))`;
        params.push(start_time);
        params.push(end_time);
      }

      sql += ` AND (`;
      for (let i = 0; i < teacher.length; i++) {
        if (i == 0) {
          sql += `tcst.teacher_id=$${params.length + 1}`;
        } else {
          sql += ` OR tcst.teacher_id=$${params.length + 1}`;
        }
        params.push(teacher[i]);
      }
      sql += `)`;

      result = await pool.query(sql, params);
      data.teacher = result.rows;
    }

    // 學生列表
    if (student.length == 0) {
      data.student = [];
    } else {
      sql = `SELECT tcs.course_name, tcs.classroom_name, tcs.course_date, tcs.start_time, tcs.end_time, u.first_name c_name, u.nick_name 
            FROM tutoring_course_schedule tcs
            INNER JOIN tutoring_course_schedule_student tcss ON tcs.id = tcss.schedule_id
            INNER JOIN student s ON s.id = tcss.student_id
            INNER JOIN "user" u ON u.id = s.user_id
            WHERE (tcs.course_date >= $1 AND tcs.course_date <= $2)`;
      params = [start, end];
      // 時間區間
      if (start_time && end_time) {
        sql += ` AND ((start_time <= $3 AND end_time >= $3) OR (start_time <= $4 AND end_time >= $4))`;
        params.push(start_time);
        params.push(end_time);
      }

      sql += ` AND (`;
      for (let i = 0; i < student.length; i++) {
        if (i == 0) {
          sql += `tcss.student_id=$${params.length + 1}`;
        } else {
          sql += ` OR tcss.student_id=$${params.length + 1}`;
        }
        params.push(student[i]);
      }
      sql += `)`;

      result = await pool.query(sql, params);
      data.student = result.rows;
    }

    await pool.query("COMMIT");
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: "系統錯誤" });
  }
}
