import pool from "/lib/pgdb";
import { checkPerm } from "./check";

export default async function handler(req, res) {
  const user_id = req.headers.user_id;
  let check = true;
  const id = req.query.id;
  const { preparation, preparationdetail, signature } = req.body;
  switch (req.method) {
    case "GET":
      check = await checkPerm(user_id, "01c28c0a-07cd-c213-94d3-fada3c8a5657");
      if (!check) {
        res.status(425).json({ detail: "權限不足" });
        return;
      }
      try {
        const type = req.query.type;
        let index = false;
        if (type) {
          index = JSON.parse(req.query.index);
        }
        let sql = `
          SELECT 
            preparation.id, chinese_name, english_name, city_id, dist_id, school_id, school_name, school_type_id, grade_id, gender, birthday, preparation.address, mother_name, mother_phone, father_name, father_phone, emergency_contact_name, 
            emergency_contact, signature, remark, meeting, exam, admission, tutoring_id, updatedon, trialclass, arrive, isclose, level, test, createdon
          FROM preparation
          LEFT JOIN twschool ON twschool.id = preparation.school_id
        `;
        let params = [];
        if (id) {
          let data = {};
          await pool.query("BEGIN");
          sql += ` WHERE preparation.id=$1`;
          params.push(id);
          let result = await pool.query(sql, params);
          data.entity = result.rows[0];
          sql = `SELECT selectid FROM preparationdetail WHERE preparationid=$1`;
          result = await pool.query(sql, params);
          data.detail = result.rows;
          await pool.query("COMMIT");
          res.status(200).json(data);
        } else {
          if (type == 1) {
            sql += ` ORDER BY tutoring_id`;
            if (index) {
              sql += ` DESC`;
            }
          } else if (type == 2) {
            sql += ` ORDER BY chinese_name`;
            if (index) {
              sql += ` DESC`;
            }
          } else if (type == 3) {
            sql += ` ORDER BY CASE WHEN meeting IS NULL THEN 1 ELSE 0 END, meeting`;
            if (index) {
              sql += ` DESC`;
            }
          } else if (type == 4) {
            sql += ` ORDER BY CASE WHEN exam IS NULL THEN 1 ELSE 0 END, exam`;
            if (index) {
              sql += ` DESC`;
            }
          } else if (type == 5) {
            sql += ` ORDER BY CASE WHEN trialclass IS NULL THEN 1 ELSE 0 END, trialclass`;
            if (index) {
              sql += ` DESC`;
            }
          } else if (type == 6) {
            sql += ` ORDER BY CASE WHEN level IS NULL THEN 1 ELSE 0 END, level`;
            if (index) {
              sql += ` DESC`;
            }
          } else if (type == 7) {
            sql += ` ORDER BY CASE WHEN arrive IS NULL THEN 1 ELSE 0 END, arrive`;
            if (index) {
              sql += ` DESC`;
            }
          } else if (type == 8) {
            sql += ` ORDER BY CASE WHEN test IS NULL THEN 1 ELSE 0 END, test`;
            if (index) {
              sql += ` DESC`;
            }
          } else {
            sql += ` ORDER BY CASE WHEN updatedon IS NULL THEN 1 ELSE 0 END, updatedon DESC`;
          }

          let result = await pool.query(sql);
          res.status(200).json(result.rows);
          return;
        }
      } catch (error) {
        console.log(error);
        res.status(400).json({ msg: "系統錯誤" });
      }
      break;
    case "PUT":
      check = await checkPerm(user_id, "a1723dce-3980-4e43-fba0-0d3c6132f0c4");
      if (!check) {
        res.status(425).json({ detail: "權限不足" });
        return;
      }
      try {
        let sql = `
        UPDATE preparation
        SET chinese_name=$1, english_name=$2, school_id=$3, grade_id=$4, gender=$5, birthday=$6, address=$7, mother_name=$8, 
            mother_phone=$9, father_name=$10, father_phone=$11, emergency_contact_name=$12, emergency_contact=$13, signature=$14, remark=$15, 
            meeting=$16, exam=$17, admission=$18, trialclass=$20, updatedon=now(), isclose=$21, test=$22, arrive=$23, level=$24 WHERE id=$19
        `;
        let params = [
          preparation.chinese_name,
          preparation.english_name,
          preparation.school_id,
          preparation.grade_id,
          preparation.gender,
          preparation.birthday,
          preparation.address,
          preparation.mother_name,
          preparation.mother_phone,
          preparation.father_name,
          preparation.father_phone,
          preparation.emergency_contact_name,
          preparation.emergency_contact,
          signature,
          preparation.remark,
          preparation.meeting,
          preparation.exam,
          preparation.admission,
          preparation.id,
          preparation.trialclass,
          preparation.isclose,
          preparation.test,
          preparation.arrive,
          preparation.level
        ];

        await pool.query("BEGIN");
        await pool.query(sql, params);
        await pool.query(`DELETE FROM preparationdetail WHERE preparationid=$1`, [preparation.id]);
        for (let item of preparationdetail) {
          sql = `INSERT INTO preparationdetail(preparationid, selectid)VALUES ($1, $2);`;
          params = [preparation.id, item];
          await pool.query(sql, params);
        }
        await pool.query("COMMIT");
        res.status(200).json({});
      } catch (error) {
        console.log(error);
        res.status(400).json({ msg: "系統錯誤" });
      }
      break;
    case "POST":
      check = await checkPerm(user_id, "ec4237a7-4158-c47e-0b25-29862392ff1d");
      if (!check) {
        res.status(425).json({ detail: "權限不足" });
        return;
      }
      try {
        let sql = "";
        let params = [];
        await pool.query("BEGIN");
        sql = `INSERT INTO preparation(chinese_name, english_name, school_id, grade_id, gender, birthday, address, mother_name, mother_phone, 
                father_name, father_phone, emergency_contact_name, emergency_contact, signature, meeting, exam, tutoring_id, admission, remark, trialclass, updatedon=now()) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16 ,$17 ,$18, $19) RETURNING id;`;
        params = [
          preparation.chinese_name,
          preparation.english_name,
          preparation.school_id,
          preparation.grade_id,
          preparation.gender,
          preparation.birthday,
          preparation.address,
          preparation.mother_name,
          preparation.mother_phone,
          preparation.father_name,
          preparation.father_phone,
          preparation.emergency_contact_name,
          preparation.emergency_contact,
          signature,
          preparation.meeting,
          preparation.exam,
          preparation.tutoring_id,
          preparation.admission,
          preparation.remark,
          preparation.trialclass
        ];
        let result = await pool.query(sql, params);
        for (let item of preparationdetail) {
          sql = `INSERT INTO preparationdetail(preparationid, selectid)VALUES ($1, $2);`;
          params = [result.rows[0].id, item];
          await pool.query(sql, params);
        }

        await pool.query("COMMIT");
        res.status(200).json({ id: result.rows[0].id });
      } catch (error) {
        console.log(error);
        res.status(400).json({ msg: "系統錯誤" });
      }
      break;
  }
}
