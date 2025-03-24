"use client";

import { useEffect, useRef, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import List from "../../schedule/list";
import { error } from "../../../utils";

const weekStr = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

export default function Home({ student_id, setInfo }) {
  const [course, setCourse] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [over, setOver] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  async function getCourse() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/course/student/${student_id}`, config);
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
    if (student_id != 0) {
      getCourse();
    }
  }, [student_id]);

  const Mon = course.filter((i) => i.week == 0);
  const Tue = course.filter((i) => i.week == 1);
  const Wed = course.filter((i) => i.week == 2);
  const Thu = course.filter((i) => i.week == 3);
  const Fri = course.filter((i) => i.week == 4);
  const Sat = course.filter((i) => i.week == 5);
  const Sun = course.filter((i) => i.week == 6);

  const filterSchedule = over
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
      <Dialog
        open={open}
        onClose={setOpen}
        className="relative z-10"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center text-center">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div className="w-screen min-h-screen p-4">
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setOpen(false);
                    }}
                    type="button"
                    className={`mx-2 relative inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold text-gray-900 bg-white ring-1 ring-inset ring-pink-300 hover:bg-red-50 focus:z-10`}
                  >
                    關閉
                  </button>
                </div>
                <List />
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      <div className="container mx-auto">
        {loading ? (
          <div className="flex justify-center items-center mt-40">
            <div className="spinner"></div>
            <span className="mx-4 text-blue-500">資料讀取中...</span>
          </div>
        ) : (
          <div className="bg-white ring-1 ring-gray-900/5 rounded-xl">
            <div className="grid grid-cols-7 bg-white p-1 rounded-xl">
              <div className="col-span-1">
                <ul
                  role="list"
                  className="divide-y divide-gray-200 mx-1"
                >
                  <li className="py-1 flex justify-center bg-gray-700 text-gray-200 rounded-md">星期一</li>
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
                  <li className="py-1 rounded-md flex justify-center bg-gray-700 text-gray-200">星期二</li>
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
                  <li className="py-1 rounded-md flex justify-center bg-gray-700 text-gray-200">星期三</li>
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
                  <li className="py-1 rounded-md flex justify-center bg-gray-700 text-gray-200">星期四</li>
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
                  <li className="py-1 rounded-md flex justify-center bg-gray-700 text-gray-200">星期五</li>
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
                  <li className="py-1 rounded-md flex justify-center bg-gray-700 text-gray-200">星期六</li>
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
                  <li className="py-1 rounded-md flex justify-center bg-gray-700 text-gray-200">星期日</li>
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
            <div className="text-2xl m-4 flex items-center">
              <span>課表</span>
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
                <button
                  onClick={() => {
                    setOpen(true);
                  }}
                  type="button"
                  className={`mx-2 relative inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold text-gray-900 bg-green-400 ring-1 ring-inset ring-gray-300 hover:bg-red-50 focus:z-10`}
                >
                  加入課程
                </button>
              </span>
            </div>
            <div className="grid grid-cols-4 bg-white shadow-sm ring-1 ring-gray-200 rounded-xl p-4">
              {filterSchedule.map((i, index) => {
                const start = i.start_time.split(":");
                const end = i.end_time.split(":");
                const week = new Date(i.course_date).getDay();
                return (
                  <div
                    key={index}
                    onClick={() => {
                      window.location.href = `/admin/course?id=${i.id}`;
                    }}
                    className="col-span-1 border-2 m-1 p-1 rounded-md hover:bg-gray-200 cursor-pointer"
                  >
                    <div className="flex justify-between">
                      <div>
                        <span
                          className="bg-blue-900 py-1 px-2 rounded-lg"
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
                        {i.leave_type == 1 ? (i.check_in_time != null ? "已到" : "未點名") : i.leave_type == 2 ? "事假" : "病假"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>
                        {i.course_date}({weekStr[week]})
                      </span>
                      <span>
                        {start[0]}:{start[1]}~{end[0]}:{end[1]}
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
