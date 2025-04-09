"use client";

import { useEffect, useState } from "react";
import Alert from "../alert";
import { error, notificationPerson } from "../../utils";

const today = new Date().toISOString().split("T")[0];

export default function Home() {
  const [info, setInfo] = useState({
    show: false,
    success: false,
    msg: ""
  });
  const [itemsList, setItemsList] = useState([]);
  const [startDate, setStartDate] = useState(today);
  const [EndDate, setEndDate] = useState(today);
  const [query, setQuery] = useState("");

  const filteredItems =
    query === ""
      ? itemsList
      : itemsList.filter((item) => {
          const course_name = item.course_name?.toLowerCase() || "";
          return course_name.includes(query.toLowerCase());
        });

  async function getItemList() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/contact_book/teacher?startDate=${startDate}&EndDate=${EndDate}`, config);
    const res = await response.json();
    if (response.ok) {
      setItemsList(res);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  useEffect(() => {
    getItemList();
  }, [startDate, EndDate]);

  return (
    <>
      <Alert
        info={info}
        setInfo={setInfo}
      />
      <div className="container mx-auto p-2">
        <div className="flex justify-around my-2">
          <div>
            <input
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
              }}
              type="date"
              className="mx-2 px-2 py-1 ring text-sky-600 rounded-md"
            />
            <input
              value={EndDate}
              onChange={(e) => {
                setEndDate(e.target.value);
              }}
              type="date"
              className="mx-2 px-2 py-1 ring text-sky-600 rounded-md"
            />
          </div>

          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            type="text"
            placeholder="課程"
            className="px-2 py-1 ring text-sky-600 rounded-md"
          />
        </div>
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="border-2 bg-yellow-50 text-center">
            <tr>
              <th
                scope="col"
                className="px-2 py-1 text-sm font-semibold text-gray-900 whitespace-nowrap"
              >
                日期
              </th>
              <th
                scope="col"
                className="px-2 py-1 text-sm font-semibold text-gray-900 whitespace-nowrap"
              >
                課程
              </th>
              <th
                scope="col"
                className="px-2 py-1 text-sm font-semibold text-gray-900 whitespace-nowrap"
              >
                時段
              </th>
              <th
                scope="col"
                className="px-2 py-1 text-sm font-semibold text-gray-900 whitespace-nowrap"
              >
                老師
              </th>
              <th
                scope="col"
                className="px-2 py-1 text-sm font-semibold text-gray-900 whitespace-nowrap"
              >
                教室
              </th>
              <th
                scope="col"
                className="px-2 py-1 text-sm font-semibold text-gray-900 whitespace-nowrap"
              >
                內容
              </th>
              <th
                scope="col"
                className="px-2 py-1 text-sm font-semibold text-gray-900 whitespace-nowrap"
              >
                作業
              </th>
              <th
                scope="col"
                className="px-2 py-1 text-sm font-semibold text-gray-900 whitespace-nowrap"
              >
                考試
              </th>
              <th
                scope="col"
                className="px-2 py-1 text-sm font-semibold text-gray-900 whitespace-nowrap"
              >
                提醒
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {filteredItems.map((course, index) => (
              <tr
                key={index}
                className="text-sm text-left border-2 divide-x divide-gray-200 hover:bg-blue-100"
              >
                <td className="py-3 px-2">{course.course_date}</td>
                <td className="py-3 px-2">{course.course_name}</td>
                <td className="py-3 px-2">
                  {course.start_time.substr(0, 5)}~{course.end_time.substr(0, 5)}
                </td>
                <td className="py-3 px-2">{course.teacher}</td>
                <td className="py-3 px-2">{course.classroom_name}</td>
                <td className={`${!course.progress ? "bg-pink-50" : "bg-white"} py-3 px-2 w-1/6`}>{course.progress}</td>
                <td className={`${!course.homework ? "bg-pink-50" : "bg-white"} py-3 px-2 w-1/6`}>{course.homework}</td>
                <td className={`${!course.next_quiz ? "bg-pink-50" : "bg-white"} py-3 px-2 w-1/6`}>{course.next_quiz}</td>
                <td className={`${!course.next_quiz ? "bg-pink-50" : "bg-white"} py-3 px-2`}>
                  <button
                    onClick={() => {
                      notificationPerson({
                        user_id: course.user_id,
                        title: `聯絡簿未填寫提醒！`,
                        message: `${course.course_date} ${course.course_name} 日誌未填寫，請盡快補上！`
                      });
                    }}
                    className="text-blue-600 hover:text-red-600"
                  >
                    發送提醒
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
