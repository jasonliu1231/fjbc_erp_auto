"use client";

import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, EllipsisHorizontalIcon, MapPinIcon } from "@heroicons/react/20/solid";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { useEffect, useRef, useState } from "react";
import { error } from "../../utils";
import Contactbook from "./contactbook";

const student_state = [
  {
    title: "上課",
    color: "text-green-600",
    bgc: "bg-green-100"
  },
  {
    title: "下課",
    color: "text-gray-900",
    bgc: "bg-gray-400"
  },
  {
    title: "應到(未到)",
    color: "text-yellow-500",
    bgc: "bg-yellow-50"
  },
  {
    title: "點名有誤",
    color: "text-red-500",
    bgc: "bg-red-100"
  },
  {
    title: "事假(有點名)",
    color: "text-red-500",
    bgc: "bg-red-100"
  },
  {
    title: "事假",
    color: "text-pink-500",
    bgc: "bg-pink-100"
  },
  {
    title: "病假(有點名)",
    color: "text-red-500",
    bgc: "bg-red-100"
  },
  {
    title: "病假",
    color: "text-pink-500",
    bgc: "bg-pink-100"
  }
];

const def_state = {
  leave_type: 1,
  leave_reason: "",
  s_h: "",
  s_m: "",
  e_h: "",
  e_m: "",
  leave_start_time: "",
  leave_end_time: ""
};

const now = new Date();

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// 獲取當月第一天是星期幾
function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

// 獲取當月有多少天
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

// 獲取上個月的天數列表
function getDaysInLastMonth(year, month) {
  const firstDayOfMonth = getFirstDayOfMonth(year, month);
  const last = new Date(year, month, 0);
  const lastMonthDays = new Date(last);
  let days = [];

  for (let i = 0; i < firstDayOfMonth; i++) {
    const data = {
      date: `${lastMonthDays.getFullYear()}-${(lastMonthDays.getMonth() + 1).toString().padStart(2, "0")}-${(lastMonthDays.getDate() - i).toString().padStart(2, "0")}`,

      isCurrentMonth: false,
      isToday: false
    };
    days.unshift(data);
  }

  return days;
}

// 計算需要的行數
function calculateRows(firstDayOfMonth, totalDays) {
  const totalCells = firstDayOfMonth + totalDays;
  return totalCells > 35 ? 6 : 5; // 超過35天的話用6行
}

function timeStr(date, time) {
  const [year, month, day] = date.split("-");
  const [hours, minutes, seconds] = time.split(":");
  const targetTime = new Date(year, month - 1, day, hours, minutes, seconds);

  return targetTime;
}

// 生成日曆天數
function generateCalendar(year, month) {
  const date = new Date();
  const y = date.getFullYear();
  const m = date.getMonth();
  const d = date.getDate();
  const firstDayOfMonth = getFirstDayOfMonth(year, month); //當月第一天是星期幾
  const daysInCurrentMonth = getDaysInMonth(year, month); // 當月的天數

  const rows = calculateRows(firstDayOfMonth, daysInCurrentMonth); // 確定行數

  const lastMonthDays = getDaysInLastMonth(year, month); // 上月天數

  // 合併日曆天數
  let calendarDays = [...lastMonthDays];

  for (let i = 1; i <= daysInCurrentMonth; i++) {
    const data = {
      date: `${year}-${(month + 1).toString().padStart(2, "0")}-${i.toString().padStart(2, "0")}`,
      isCurrentMonth: true,
      isToday: y == year && m == month && d == i ? true : false,
      isSelected: y == year && m == month && d == i ? true : false
    };
    calendarDays.push(data);
  }

  const totalCells = rows * 7; // 總單元格數量

  // 添加下月天數
  const nextMonthDays = [];
  for (let i = 1; calendarDays.length + nextMonthDays.length < totalCells; i++) {
    const data = {
      date: `${year}-${(month + 2).toString().padStart(2, "0")}-${i.toString().padStart(2, "0")}`,
      isCurrentMonth: false,
      isToday: false
    };
    nextMonthDays.push(data);
  }

  // 返回完整的日曆列表
  return [...calendarDays, ...nextMonthDays];
}

function monthStr(number) {
  let str = "";
  switch (number) {
    case 0:
      str = "一月";
      break;
    case 1:
      str = "二月";
      break;
    case 2:
      str = "三月";
      break;
    case 3:
      str = "四月";
      break;
    case 4:
      str = "五月";
      break;
    case 5:
      str = "六月";
      break;
    case 6:
      str = "七月";
      break;
    case 7:
      str = "八月";
      break;
    case 8:
      str = "九月";
      break;
    case 9:
      str = "十月";
      break;
    case 10:
      str = "十一月";
      break;
    case 11:
      str = "十二月";
      break;
  }

  return str;
}

export default function Example({ setInfo }) {
  const schedule = useRef({});
  const [state, setState] = useState(def_state);
  const [student, setStudent] = useState([]);
  const [classList, setClassList] = useState([]);
  const [days, setDays] = useState([]);
  const [year, setYear] = useState();
  const [selectMonth, setSelectMonth] = useState();
  const [select, setSelect] = useState({});
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const [tutoringType, setTutoringType] = useState(1);

  const filterClass = classList.filter((i) => i.tutoring_id == tutoringType);

  async function getClass(date) {
    setStudent([]);
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/course_schedule/list?course_date=${date}`, config);
    const res = await response.json();

    if (response.ok) {
      setClassList(res.list);
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

  async function getStudent(id) {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/rollcall_student/${id}`, config);
    const res = await response.json();

    if (response.ok) {
      setStudent(res.list);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function setStatus() {
    if (state.leave_type != 1) {
      if (!state.leave_reason) {
        setInfo({ show: true, success: false, msg: "請假請填寫原因" });
        return;
      }
      if (!state.leave_start_time) {
        setInfo({ show: true, success: false, msg: "請填寫起始時間" });
        return;
      }
      if (!state.leave_end_time) {
        setInfo({ show: true, success: false, msg: "請填寫結束時間" });
        return;
      }
    }

    const config = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(state)
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/course_schedule_student/${select.id}/update`, config);
    const res = await response.json();
    if (response.ok) {
      setState(def_state);
      getStudent(res.schedule_id);
      setInfo({
        show: true,
        success: true,
        msg: "修改完成"
      });
      setOpen(false);
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
    const now = new Date();
    const nowYear = now.getFullYear();
    const nowMonth = now.getMonth();
    setYear(nowYear);
    setSelectMonth(nowMonth);
    getClass(`${nowYear}-${(nowMonth + 1).toString().padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`);
  }, []);

  useEffect(() => {
    const days = generateCalendar(year, selectMonth);
    setDays(days);
  }, [year, selectMonth]);

  function PreviousMonth() {
    const date = new Date(year, selectMonth, 1); // 將日期設置為月初，以免日期超過
    date.setMonth(selectMonth - 1);
    const y = date.getFullYear();
    const m = date.getMonth();
    setYear(y);
    setSelectMonth(m);
  }

  function NextMonth() {
    const date = new Date(year, selectMonth, 1);
    date.setMonth(selectMonth + 1);
    const y = date.getFullYear();
    const m = date.getMonth();
    setYear(y);
    setSelectMonth(m);
  }

  function selectDate(date) {
    const array = [];
    days.forEach((day) => {
      if (day.date == date) {
        day.isSelected = true;
        array.push(day);
      } else {
        day.isSelected = false;
        array.push(day);
      }
    });
    setDays(array);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-40">
        <div className="spinner"></div>
        <span className="mx-4 text-blue-500">資料讀取中...</span>
      </div>
    );
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={() => {}}
        className="relative z-10"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-sm sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div className="text-center text-2xl mb-4">
                {select.c_name}({select.e_name})
              </div>
              <div className="flex justify-around">
                <span
                  onClick={() => {
                    setState({
                      ...state,
                      leave_type: 1
                    });
                    console.log();
                  }}
                  className={`${state.leave_type == 1 ? "border-blue-400 text-blue-600" : "border-gray-400 text-gray-600"} border-2 px-4 py-2  hover:bg-gray-300`}
                >
                  應到
                </span>
                <span
                  onClick={() => {
                    setState({
                      ...state,
                      leave_type: 2
                    });
                  }}
                  className={`${state.leave_type == 2 ? "border-blue-400 text-blue-600" : "border-gray-400 text-gray-600"} border-2 px-4 py-2  hover:bg-gray-300`}
                >
                  事假
                </span>
                <span
                  onClick={() => {
                    setState({
                      ...state,
                      leave_type: 3
                    });
                  }}
                  className={`${state.leave_type == 3 ? "border-blue-400 text-blue-600" : "border-gray-400 text-gray-600"} border-2 px-4 py-2  hover:bg-gray-300`}
                >
                  病假
                </span>
              </div>
              <div>
                {state.leave_type != 1 && (
                  <>
                    <div className="">
                      <label className="block text-sm/6 font-medium text-gray-900 text-left">起始時間</label>
                      <div className="flex">
                        <select
                          value={state.s_h}
                          onChange={(e) => {
                            setState({
                              ...state,
                              s_h: e.target.value,
                              leave_start_time: `${e.target.value.padStart(2, "0")}:${state.s_m.toString().padStart(2, "0")}`
                            });
                          }}
                          className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm/6"
                        >
                          {Array.from({ length: 24 }, (_, index) => {
                            return (
                              <option
                                key={index}
                                value={index}
                              >
                                {index}時
                              </option>
                            );
                          })}
                        </select>
                        <select
                          value={state.s_m}
                          onChange={(e) => {
                            setState({
                              ...state,
                              s_m: e.target.value,
                              leave_start_time: `${state.s_h.toString().padStart(2, "0")}:${e.target.value.padStart(2, "0")}`
                            });
                          }}
                          className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm/6"
                        >
                          {Array.from({ length: 60 }, (_, index) => {
                            return (
                              <option
                                key={index}
                                value={index}
                              >
                                {index}分
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                    <div className="">
                      <label className="block text-sm/6 font-medium text-gray-900 text-left">結束時間</label>
                      <div className="flex">
                        <select
                          value={state.e_h}
                          onChange={(e) => {
                            setState({
                              ...state,
                              e_h: e.target.value,
                              leave_end_time: `${e.target.value.padStart(2, "0")}:${state.e_m.toString().padStart(2, "0")}`
                            });
                          }}
                          className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm/6"
                        >
                          {Array.from({ length: 24 }, (_, index) => {
                            return (
                              <option
                                key={index}
                                value={index}
                              >
                                {index}時
                              </option>
                            );
                          })}
                        </select>
                        <select
                          value={state.e_m}
                          onChange={(e) => {
                            setState({
                              ...state,
                              e_m: e.target.value,
                              leave_end_time: `${state.e_h.toString().padStart(2, "0")}:${e.target.value.padStart(2, "0")}`
                            });
                          }}
                          className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm/6"
                        >
                          {Array.from({ length: 60 }, (_, index) => {
                            return (
                              <option
                                key={index}
                                value={index}
                              >
                                {index}分
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                    <div className="mt-2">
                      <textarea
                        value={state.leave_reason}
                        onChange={(e) => {
                          setState({
                            ...state,
                            leave_reason: e.target.value
                          });
                        }}
                        rows={3}
                        className="py-1.5 px-3 ring-2 ring-gray-300 w-full rounded-md"
                        placeholder="請假請寫入原因"
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                  }}
                  className="mx-2 inline-flex justify-center rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStatus();
                  }}
                  className="mx-2 inline-flex justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  送出
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      <div className="container mx-auto">
        <div className="grid grid-cols-12 gap-x-3">
          <div className="mt-2 text-center col-span-3">
            <div className="flex items-center text-gray-900">
              <button
                type="button"
                className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                onClick={PreviousMonth}
              >
                <span className="sr-only">Previous month</span>
                <ChevronLeftIcon
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              </button>
              <div className="flex-auto text-sm font-semibold">
                {year} / {monthStr(selectMonth)}
              </div>
              <button
                type="button"
                className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                onClick={NextMonth}
              >
                <span className="sr-only">Next month</span>
                <ChevronRightIcon
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              </button>
            </div>
            <div className="mt-6 grid grid-cols-7 text-xs leading-6 text-gray-500">
              <div>日</div>
              <div>一</div>
              <div>二</div>
              <div>三</div>
              <div>四</div>
              <div>五</div>
              <div>六</div>
            </div>
            <div className="isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow ring-1 ring-gray-200">
              {days.map((day, dayIdx) => (
                <button
                  key={day.date}
                  type="button"
                  className={classNames(
                    "py-1.5 hover:bg-gray-100 focus:z-10",
                    day.isCurrentMonth ? "bg-white" : "bg-gray-50",
                    (day.isSelected || day.isToday) && "font-semibold",
                    day.isSelected && "text-white",
                    !day.isSelected && day.isCurrentMonth && !day.isToday && "text-gray-900",
                    !day.isSelected && !day.isCurrentMonth && !day.isToday && "text-gray-400",
                    day.isToday && !day.isSelected && "text-red-600",
                    dayIdx === 0 && "rounded-tl-lg",
                    dayIdx === 6 && "rounded-tr-lg",
                    dayIdx === days.length - 7 && "rounded-bl-lg",
                    dayIdx === days.length - 1 && "rounded-br-lg"
                  )}
                  onClick={() => {
                    getClass(day.date);
                    selectDate(day.date);
                  }}
                >
                  <time
                    dateTime={day.date}
                    className={classNames(
                      "mx-auto flex h-7 w-7 items-center justify-center rounded-full",
                      day.isSelected && day.isToday && "bg-red-600",
                      day.isSelected && !day.isToday && "bg-gray-900"
                    )}
                  >
                    {day.date.split("-").pop().replace(/^0/, "")}
                  </time>
                </button>
              ))}
            </div>
          </div>
          <div className="mt-2 col-span-5 px-2">
            <div className="bg-gray-200 p-2">
              <div className="text-center">今日課程</div>
            </div>
            <div className="grid grid-cols-3">
              <div
                onClick={() => {
                  setTutoringType(1);
                  setStudent([]);
                }}
                className={`${tutoringType == 1 ? "bg-blue-200 shadow-md shadow-blue-400" : "bg-white"} text-center p-2 cursor-pointer`}
              >
                多易
              </div>
              <div
                onClick={() => {
                  setTutoringType(2);
                  setStudent([]);
                }}
                className={`${tutoringType == 2 ? "bg-blue-200 shadow-md shadow-blue-400" : "bg-white"} text-center p-2 cursor-pointer border-x`}
              >
                艾思
              </div>
              <div
                onClick={() => {
                  setTutoringType(3);
                  setStudent([]);
                }}
                className={`${tutoringType == 3 ? "bg-blue-200 shadow-md shadow-blue-400" : "bg-white"} text-center p-2 cursor-pointer`}
              >
                華而敦
              </div>
            </div>
            <div className="overflow-auto h-70vh px-2">
              {filterClass.length > 0 ? (
                filterClass.map((item, index) => (
                  <div
                    key={index}
                    className={`${
                      now < timeStr(item.course_date, item.start_time)
                        ? "bg-white"
                        : now >= timeStr(item.course_date, item.start_time) && now <= timeStr(item.course_date, item.end_time)
                        ? "bg-green-100"
                        : "bg-gray-400"
                    } p-4 my-1 rounded-md hover:opacity-75`}
                    onClick={() => {
                      schedule.current.id = item.id;
                      schedule.current.course_date = item.course_date;
                      schedule.current.course_name = item.course_name;

                      getStudent(item.id);
                      const s = item.start_time.split(":");
                      const e = item.end_time.split(":");
                      setState({
                        ...state,
                        s_h: Number(s[0]),
                        s_m: Number(s[1]),
                        e_h: Number(e[0]),
                        e_m: Number(e[1]),
                        leave_start_time: item.start_time.substr(0, 5),
                        leave_end_time: item.end_time.substr(0, 5)
                      });
                    }}
                  >
                    <div className="flex item-start justify-between">
                      <div className="text-md font-bold text-blue-600 hover:text-blue-300">
                        <a href={`/admin/course?id=${item.id}`}>{item.course_name}</a>
                      </div>
                      <div
                        style={{
                          color:
                            item.tutoring_course_status_id == 1
                              ? "#444444"
                              : item.tutoring_course_status_id == 2
                              ? "#F03F09"
                              : item.tutoring_course_status_id == 3
                              ? "#60E1F0"
                              : item.tutoring_course_status_id == 4
                              ? "#F5A3A2"
                              : item.tutoring_course_status_id == 5
                              ? "#32F084"
                              : item.tutoring_course_status_id == 6
                              ? "#60F0CF"
                              : "#444444"
                        }}
                        className="text-md text-gray-900 bg-white px-1 rounded-md font-bold"
                      >
                        {item.tutoring_course_status_id == 1
                          ? "正常上課"
                          : item.tutoring_course_status_id == 2
                          ? "停課(不補課)"
                          : item.tutoring_course_status_id == 3
                          ? "調課"
                          : item.tutoring_course_status_id == 4
                          ? "停課(需補課)"
                          : item.tutoring_course_status_id == 5
                          ? "補課"
                          : item.tutoring_course_status_id == 6
                          ? "加課"
                          : ""}
                      </div>
                    </div>
                    <div className={`text-lg text-gray-800`}>{item.teacher?.map((item) => item.c_name).join(",")}</div>
                    <div className={`${item.classroom_name ? "" : "text-red-300"} text-md text-gray-600`}>{item.classroom_name || "無教室"}</div>
                    <div className="text-sm text-gray-900 flex justify-between">
                      {item?.start_time?.substr(0, 5)}~{item?.end_time?.substr(0, 5)}
                      <Contactbook
                        schedule_id={item.id}
                        setInfo={setInfo}
                        tutoring_id={item.tutoring_id}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-red-400 text-center">今日無課程</div>
              )}
            </div>
          </div>
          <div className="mt-2 col-span-4">
            <div className="bg-gray-200 p-2">
              <div className="text-center">點名表</div>
            </div>
            <div className="overflow-auto h-70vh px-2">
              {student.length > 0 ? (
                student.map((item, index) => {
                  let student_style = "";
                  if (item.leave_type == 1) {
                    if (item.check_in_time > 0) {
                      if (item.check_in_time > item.check_out_time) {
                        student_style = 0;
                      } else if (item.check_in_time == item.check_out_time) {
                        student_style = 1;
                      }
                    } else if (item.check_in_time == 0 && item.check_out_time == 0) {
                      student_style = 2;
                    } else if (item.check_in_time < item.check_out_time) {
                      student_style = 3;
                    }
                  } else if (item.leave_type == 2) {
                    if (item.check_in_time > 0 || item.check_out_time > 0) {
                      student_style = 4;
                    } else {
                      student_style = 5;
                    }
                  } else if (item.leave_type == 3) {
                    if (item.check_in_time > 0 || item.check_out_time > 0) {
                      student_style = 6;
                    } else {
                      student_style = 7;
                    }
                  }
                  return (
                    <div
                      key={index}
                      onDoubleClick={() => {
                        setSelect(item);
                        setOpen(true);
                      }}
                      className={`${student_state[student_style].bgc} flex justify-between items-center p-4 my-1 rounded-md ring-1 ring-gray-500`}
                    >
                      <div>
                        <span className={`${item.status == 1 ? "text-blue-500 border-blue-200" : "text-red-500 border-red-200"} border  rounded-xl px-2`}>
                          {item.status == 1 ? "原班生" : item.status == 2 ? "舊試聽" : "新試聽"}
                        </span>
                        <div className="mx-1">
                          {item.c_name}({item.e_name})
                        </div>
                        <div className="mx-1">
                          點數餘額：<span className={item.point > 0 ? "text-green-600" : "text-red-600"}>{item.point}</span>
                        </div>
                      </div>
                      <div className={`${student_state[student_style].color}`}>{student_state[student_style].title}</div>
                    </div>
                  );
                })
              ) : (
                <div className="text-red-400 text-center">無學生</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
