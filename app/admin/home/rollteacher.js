"use client";

import { useEffect, useState } from "react";
import { error } from "../../utils";

export default function Example({ setInfo }) {
  const [teacherRollCall, setTeacherRollCall] = useState([]);
  const [loading, setLoading] = useState(true);

  async function getRollCall() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/course_schedule_teacher/current/roll/list`, config);
    const res = await response.json();
    if (response.ok) {
      setTeacherRollCall(res);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
    setLoading(false);
  }

  useEffect(() => {
    getRollCall();
    setInterval(() => {
      getRollCall();
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
      <div className="bg-white px-4 rounded-md h-80vh overflow-auto">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="">
            <tr className="divide-x divide-gray-200 bg-green-100 sticky top-0">
              <th
                scope="col"
                className="py-2 pl-2 text-sm font-semibold text-gray-900"
              >
                課程
              </th>
              <th
                scope="col"
                className="py-2 pr-2 text-sm font-semibold text-gray-900"
              >
                老師
              </th>
              <th
                scope="col"
                className="py-2 pr-2 text-sm font-semibold text-gray-900"
              >
                身份
              </th>
              <th
                scope="col"
                className="py-2 pr-2 text-sm font-semibold text-gray-900"
              >
                上課時間
              </th>
              <th
                scope="col"
                className="py-2 pr-2 text-sm font-semibold text-gray-900"
              >
                下課時間
              </th>
              <th
                scope="col"
                className="py-2 pr-2 text-sm font-semibold text-gray-900"
              >
                上課打卡
              </th>
              <th
                scope="col"
                className="py-2 pr-2 text-sm font-semibold text-gray-900"
              >
                下課打卡
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white h-70vh overflow-auto">
            {teacherRollCall.map((item, index) => {
              return (
                <tr
                  key={index}
                  className={`divide-x divide-gray-200 text-center hover:bg-blue-100`}
                >
                  <td className="whitespace-nowrap py-2 pl-2 text-sm text-gray-900">{item.course_name}</td>
                  <td className="whitespace-nowrap py-2 pl-2 text-sm text-gray-900">{item.c_name}</td>
                  <td className="whitespace-nowrap py-2 pl-2 text-sm text-gray-900">{item.content}</td>
                  <td className="whitespace-nowrap py-2 pl-2 text-sm text-gray-500">{item.start_time?.substr(0, 5)}</td>
                  <td className="whitespace-nowrap py-2 pl-2 text-sm text-gray-500">{item.end_time?.substr(0, 5)}</td>
                  <td className="whitespace-nowrap py-2 pl-2 text-sm text-pink-500">{item.check_in_time?.substr(0, 5)}</td>
                  <td className="whitespace-nowrap py-2 pr-2 text-sm text-pink-500">{item.check_out_time?.substr(0, 5)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
