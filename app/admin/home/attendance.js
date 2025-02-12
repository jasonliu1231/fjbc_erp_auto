"use client";

import { useEffect, useState } from "react";
import { error } from "../../utils";

export default function Example({ setInfo }) {
  const [studentAttendance, setStudentAttendance] = useState([]);
  const [teacherAttendance, setTeacherAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  async function getAttendance() {
    const date = new Date().toISOString().split("T")[0];
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const student = fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/attendance_student/${date}`, config);
    const teacher = fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/attendance_teacher/${date}`, config);

    Promise.all([student, teacher])
      .then(async ([student, teacher]) => {
        const student_res = await student.json();
        const teacher_res = await teacher.json();
        if (student.ok) {
          setStudentAttendance(student_res.list);
        } else {
          const msg = error(student.status, student_res);
          setInfo({
            show: true,
            success: false,
            msg: "錯誤" + msg
          });
        }

        if (teacher.ok) {
          setTeacherAttendance(teacher_res.list);
        } else {
          const msg = error(teacher.status, teacher_res);
          setInfo({
            show: true,
            success: false,
            msg: "錯誤" + msg
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    getAttendance();
    setInterval(() => {
      getAttendance();
    }, 5 * 60 * 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-40">
        <div className="spinner"></div>
        <span className="mx-4 text-blue-500">資料讀取中...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-2 bg-white px-4 py-2 rounded-md">
        <div className="col-spam-1 px-4">
          <div className="text-lg text-blue-600 border-b-2">老師</div>
          <table className="min-w-full divide-y divide-gray-300 h-70vh overflow-auto">
            <thead className="sticky top-0">
              <tr className="divide-x divide-gray-200 bg-green-100">
                <th
                  scope="col"
                  className="py-2 pl-2 text-sm font-semibold text-gray-900"
                >
                  名稱
                </th>
                <th
                  scope="col"
                  className="py-2 pr-2 text-sm font-semibold text-gray-900"
                >
                  到校時間
                </th>
                <th
                  scope="col"
                  className="py-2 pr-2 text-sm font-semibold text-gray-900"
                >
                  離校時間
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {teacherAttendance.map((item, index) => {
                return (
                  <tr
                    key={index}
                    className={`divide-x divide-gray-200 text-center hover:bg-blue-100`}
                  >
                    <td className="whitespace-nowrap py-2 pl-2 text-sm text-gray-900">{item.teacher.user.first_name}</td>
                    <td className="whitespace-nowrap py-2 pl-2 text-sm text-pink-500">{item.arrival_time?.substr(0, 5)}</td>
                    <td className="whitespace-nowrap py-2 pr-2 text-sm text-pink-500">{item.leave_time?.substr(0, 5)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="col-spam-1 px-1">
          <div className="text-lg text-blue-600 border-b-2">學生</div>
          <table className="min-w-full divide-y divide-gray-300 h-70vh overflow-auto">
            <thead className="sticky top-0">
              <tr className="divide-x divide-gray-200 bg-green-100">
                <th
                  scope="col"
                  className="py-2 pl-2 text-sm font-semibold text-gray-900"
                >
                  名稱
                </th>
                <th
                  scope="col"
                  className="py-2 pr-2 text-sm font-semibold text-gray-900"
                >
                  到校時間
                </th>
                <th
                  scope="col"
                  className="py-2 pr-2 text-sm font-semibold text-gray-900"
                >
                  離校時間
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {studentAttendance.map((item, index) => {
                return (
                  <tr
                    key={index}
                    className={`divide-x divide-gray-200 text-center hover:bg-blue-100`}
                  >
                    <td className="whitespace-nowrap py-2 pl-2 text-sm text-gray-900">{item.student.user.first_name}</td>
                    <td className="whitespace-nowrap py-2 pl-2 text-sm text-pink-500">{item.arrival_time?.substr(0, 5)}</td>
                    <td className="whitespace-nowrap py-2 pr-2 text-sm text-pink-500">{item.leave_time?.substr(0, 5)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
