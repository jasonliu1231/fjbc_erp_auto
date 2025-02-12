"use client";

import { useEffect, useRef, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { error } from "../../../utils";

const weekStr = ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"];
const current_year = new Date().getFullYear();

export default function Home({ teacher_id, setInfo }) {
  const [course, setCourse] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [over, setOver] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState({
    teacher_id: teacher_id,
    begin: `${current_year}-01-01`,
    end: `${current_year}-12-31`
  });

  async function getCourse() {
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(search)
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/course/teacher`, config);
    const res = await response.json();

    if (response.ok) {
      setCourse(res.course_time);
      setSchedule(res.course_schedule);
      setLoading(false);
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
    if (teacher_id != 0) {
      getCourse();
    }
  }, [search, teacher_id]);

  const Mon = course.filter((i) => i.week == 0);
  const Tue = course.filter((i) => i.week == 1);
  const Wed = course.filter((i) => i.week == 2);
  const Thu = course.filter((i) => i.week == 3);
  const Fri = course.filter((i) => i.week == 4);
  const Sat = course.filter((i) => i.week == 5);
  const Sun = course.filter((i) => i.week == 6);

  let filterSchedule = over
    ? schedule.filter((i) => {
        if (new Date(`${i.course_date} ${i.end_time}`) < new Date()) {
          return i;
        }
      })
    : schedule.filter((i) => {
        if (new Date(`${i.course_date} ${i.end_time}`) > new Date()) {
          return i;
        }
      });

  return (
    <>
      <div className="container mx-auto">
        {loading ? (
          <div className="flex justify-center items-center mt-40">
            <div className="spinner"></div>
            <span className="mx-4 text-blue-500">資料讀取中...</span>
          </div>
        ) : (
          <div className="bg-white ring-1 ring-gray-900/5 rounded-xl p-2">
            <div className="flex items-end justify-center mb-4 mt-8">
              <span className="text-2xl font-semibold">課表</span>
              <span className="isolate inline-flex rounded-md ml-4">
                <button
                  onClick={() => {
                    setOver(true);
                  }}
                  type="button"
                  className={`${
                    over ? "bg-pink-100" : "bg-white"
                  } relative inline-flex items-center rounded-l-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-red-50 focus:z-10`}
                >
                  過期
                </button>
                <button
                  onClick={() => {
                    setOver(false);
                  }}
                  type="button"
                  className={`${
                    !over ? "bg-pink-100" : "bg-white"
                  } relative inline-flex items-center rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-red-50 focus:z-10`}
                >
                  線上
                </button>
              </span>
              <span className="isolate inline-flex rounded-md ml-4">
                <input
                  value={search.begin}
                  onChange={(e) => {
                    setSearch({
                      ...search,
                      begin: e.target.value
                    });
                  }}
                  className="border px-2 py-1 rounded-l-md"
                  type="date"
                />
                <input
                  value={search.end}
                  onChange={(e) => {
                    setSearch({
                      ...search,
                      end: e.target.value
                    });
                  }}
                  className="border px-2 py-1 rounded-r-md"
                  type="date"
                />
              </span>
            </div>

            <div className="grid grid-cols-7">
              <div className="col-span-1">
                <ul
                  role="list"
                  className="divide-y divide-gray-200 mx-1"
                >
                  <li className="py-1 text-sm flex justify-center bg-gray-700 text-gray-200">星期一</li>
                  {Mon.map((item, index) => {
                    const late = new Date(item.end_date) < new Date();
                    if (!late) {
                      return (
                        <li
                          key={index}
                          className="py-1"
                          onClick={() => {
                            window.location.href = `/admin/schedule/class?id=${item.id}`;
                          }}
                        >
                          <div className="p-1 ring-1 ring-inset rounded-md cursor-pointer hover:bg-gray-200">
                            <div className="text-sm flex items-center justify-center">
                              <span> {item.course_name}</span>
                            </div>
                            <div className="text-sm text-gray-500 flex justify-center">
                              <span>{item.start_time.substr(0, 5)}</span>
                              <span>～</span>
                              <span>{item.end_time.substr(0, 5)}</span>
                            </div>
                          </div>
                        </li>
                      );
                    }
                  })}
                </ul>
              </div>
              <div className="col-span-1">
                <ul
                  role="list"
                  className="divide-y divide-gray-200 mx-1"
                >
                  <li className="py-1 text-sm flex justify-center bg-gray-700 text-gray-200">星期二</li>
                  {Tue.map((item, index) => {
                    const late = new Date(item.end_date) < new Date();
                    if (!late) {
                      return (
                        <li
                          key={index}
                          className="py-1"
                          onClick={() => {
                            window.location.href = `/admin/schedule/class?id=${item.id}`;
                          }}
                        >
                          <div className="p-1 ring-1 ring-inset rounded-md cursor-pointer hover:bg-gray-200">
                            <div className="text-sm flex items-center justify-center">
                              <span> {item.course_name}</span>
                            </div>
                            <div className="text-sm text-gray-500 flex justify-center">
                              <span>{item.start_time.substr(0, 5)}</span>
                              <span>～</span>
                              <span>{item.end_time.substr(0, 5)}</span>
                            </div>
                          </div>
                        </li>
                      );
                    }
                  })}
                </ul>
              </div>
              <div className="col-span-1">
                <ul
                  role="list"
                  className="divide-y divide-gray-200 mx-1"
                >
                  <li className="py-1 text-sm flex justify-center bg-gray-700 text-gray-200">星期三</li>
                  {Wed.map((item, index) => {
                    const late = new Date(item.end_date) < new Date();
                    if (!late) {
                      return (
                        <li
                          key={index}
                          className="py-1"
                          onClick={() => {
                            window.location.href = `/admin/schedule/class?id=${item.id}`;
                          }}
                        >
                          <div className="p-1 ring-1 ring-inset rounded-md cursor-pointer hover:bg-gray-200">
                            <div className="text-sm flex items-center justify-center">
                              <span> {item.course_name}</span>
                            </div>
                            <div className="text-sm text-gray-500 flex justify-center">
                              <span>{item.start_time.substr(0, 5)}</span>
                              <span>～</span>
                              <span>{item.end_time.substr(0, 5)}</span>
                            </div>
                          </div>
                        </li>
                      );
                    }
                  })}
                </ul>
              </div>
              <div className="col-span-1">
                <ul
                  role="list"
                  className="divide-y divide-gray-200 mx-1"
                >
                  <li className="py-1 text-sm flex justify-center bg-gray-700 text-gray-200">星期四</li>
                  {Thu.map((item, index) => {
                    const late = new Date(item.end_date) < new Date();
                    if (!late) {
                      return (
                        <li
                          key={index}
                          className="py-1"
                          onClick={() => {
                            window.location.href = `/admin/schedule/class?id=${item.id}`;
                          }}
                        >
                          <div className="p-1 ring-1 ring-inset rounded-md cursor-pointer hover:bg-gray-200">
                            <div className="text-sm flex items-center justify-center">
                              <span> {item.course_name}</span>
                            </div>
                            <div className="text-sm text-gray-500 flex justify-center">
                              <span>{item.start_time.substr(0, 5)}</span>
                              <span>～</span>
                              <span>{item.end_time.substr(0, 5)}</span>
                            </div>
                          </div>
                        </li>
                      );
                    }
                  })}
                </ul>
              </div>
              <div className="col-span-1">
                <ul
                  role="list"
                  className="divide-y divide-gray-200 mx-1"
                >
                  <li className="py-1 text-sm flex justify-center bg-gray-700 text-gray-200">星期五</li>
                  {Fri.map((item, index) => {
                    const late = new Date(item.end_date) < new Date();
                    if (!late) {
                      return (
                        <li
                          key={index}
                          className="py-1"
                          onClick={() => {
                            window.location.href = `/admin/schedule/class?id=${item.id}`;
                          }}
                        >
                          <div className="p-1 ring-1 ring-inset rounded-md cursor-pointer hover:bg-gray-200">
                            <div className="text-sm flex items-center justify-center">
                              <span> {item.course_name}</span>
                            </div>
                            <div className="text-sm text-gray-500 flex justify-center">
                              <span>{item.start_time.substr(0, 5)}</span>
                              <span>～</span>
                              <span>{item.end_time.substr(0, 5)}</span>
                            </div>
                          </div>
                        </li>
                      );
                    }
                  })}
                </ul>
              </div>
              <div className="col-span-1">
                <ul
                  role="list"
                  className="divide-y divide-gray-200 mx-1"
                >
                  <li className="py-1 text-sm flex justify-center bg-gray-700 text-gray-200">星期六</li>
                  {Sat.map((item, index) => {
                    const late = new Date(item.end_date) < new Date();
                    if (!late) {
                      return (
                        <li
                          key={index}
                          className="py-1"
                          onClick={() => {
                            window.location.href = `/admin/schedule/class?id=${item.id}`;
                          }}
                        >
                          <div className="p-1 ring-1 ring-inset rounded-md cursor-pointer hover:bg-gray-200">
                            <div className="text-sm flex items-center justify-center">
                              <span> {item.course_name}</span>
                            </div>
                            <div className="text-sm text-gray-500 flex justify-center">
                              <span>{item.start_time.substr(0, 5)}</span>
                              <span>～</span>
                              <span>{item.end_time.substr(0, 5)}</span>
                            </div>
                          </div>
                        </li>
                      );
                    }
                  })}
                </ul>
              </div>
              <div className="col-span-1">
                <ul
                  role="list"
                  className="divide-y divide-gray-200 mx-1"
                >
                  <li className="py-1 text-sm flex justify-center bg-gray-700 text-gray-200">星期日</li>
                  {Sun.map((item, index) => {
                    const late = new Date(item.end_date) < new Date();
                    if (!late) {
                      return (
                        <li
                          key={index}
                          className="py-1"
                          onClick={() => {
                            window.location.href = `/admin/schedule/class?id=${item.id}`;
                          }}
                        >
                          <div className="p-1 ring-1 ring-inset rounded-md cursor-pointer hover:bg-gray-200">
                            <div className="text-sm flex items-center justify-center">
                              <span> {item.course_name}</span>
                            </div>
                            <div className="text-sm text-gray-500 flex justify-center">
                              <span>{item.start_time.substr(0, 5)}</span>
                              <span>～</span>
                              <span>{item.end_time.substr(0, 5)}</span>
                            </div>
                          </div>
                        </li>
                      );
                    }
                  })}
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-4">
              {filterSchedule.map((i, index) => {
                const week = new Date(i.course_date).getDay();
                return (
                  <div
                    key={index}
                    onClick={() => {
                      window.location.href = `/admin/course?id=${i.id}`;
                    }}
                    className="col-span-1 ring-1 m-0.5 px-2 py-1 rounded-md hover:bg-gray-200 cursor-pointer"
                  >
                    <div className="flex justify-between">
                      <div>
                        <span
                          className="bg-blue-900 p-1 text-sm rounded-md"
                          style={{
                            color:
                              i.tutoring_course_status_id == 1
                                ? "#FCFCFC"
                                : i.tutoring_course_status_id == 2
                                ? "#F03F09"
                                : i.tutoring_course_status_id == 3
                                ? "#60E1F0"
                                : i.tutoring_course_status_id == 4
                                ? "#F5A3A2"
                                : i.tutoring_course_status_id == 5
                                ? "#32F084"
                                : i.tutoring_course_status_id == 6
                                ? "#60F0CF"
                                : "#444444"
                          }}
                        >
                          {" "}
                          {i.tutoring_course_status_id == 1
                            ? "正常"
                            : i.tutoring_course_status_id == 2
                            ? "停課(不)"
                            : i.tutoring_course_status_id == 3
                            ? "調課"
                            : i.tutoring_course_status_id == 4
                            ? "停課(需)"
                            : i.tutoring_course_status_id == 5
                            ? "補課"
                            : i.tutoring_course_status_id == 6
                            ? "加課"
                            : ""}
                        </span>
                        <span className="mx-1 font-semibold">{i.course_name}</span>
                      </div>

                      <span className={`${i.leave_type == 1 ? (i.check_in_time != null ? "text-green-400" : "text-gray-400") : "text-red-400"}`}>
                        {i.leave_type == 1 ? (i.check_in_time != null ? "已到" : "未簽到") : i.leave_type == 2 ? "事假" : "病假"}
                      </span>
                    </div>
                    <div className="flex justify-around p-1 text-sm">
                      <span className="text-gray-400">原班：{i.local_student}</span>
                      <span className="text-blue-400">試聽：{i.ask_student}</span>
                      <span className="text-red-400">請假：{i.leave_student}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>
                        {i.course_date}({weekStr[week]})
                      </span>
                      <span>
                        <span>{i.start_time.substr(0, 5)}</span>
                        <span>～</span>
                        <span>{i.end_time.substr(0, 5)}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
