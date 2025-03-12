"use client";

import { useEffect, useRef, useState } from "react";
import { XCircleIcon, PlusCircleIcon, MagnifyingGlassIcon, CheckCircleIcon } from "@heroicons/react/20/solid";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import Calender from "./calender";
import Stopcourse from "./stopcourse";
import Resetcourse from "./resetcourse";
import Changedclassroom from "./changedclassroom";
import Changedteacher from "./changedteacher";
import { Calendar } from "react-multi-date-picker";
import Alert from "../alert";
import { error } from "../../utils";

const def_update = {
  s_h: "09",
  s_m: "00",
  e_h: "09",
  e_m: "00",
  leave_start_time: "09:00",
  leave_end_time: "09:00",
  leave_type: 0,
  leave_reason: "",
  tcst_id: 0
};

const def_select = {
  s_h: "09",
  s_m: "00",
  e_h: "09",
  e_m: "00",
  course_date: new Date().toISOString().split("T")[0].replace("/", "-"),
  start_time: "09:00",
  end_time: "09:00",
  remark: ""
};

export default function Home() {
  const type = useRef();
  const [info, setInfo] = useState({
    show: false,
    success: false,
    msg: ""
  });
  const course_schedule_id = useRef();
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState({});
  const [ask_student, setAsk_student] = useState([]);
  const [schedule_student, setSchedule_student] = useState([]);
  const [schedule_teacher, setSchedule_teacher] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [teacherUpdate, setTeacherUpdate] = useState(def_update);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [open4, setOpen4] = useState(false);
  const [select, setSelect] = useState(def_select);
  const [modificationDialog, setModificationDialog] = useState(false);
  const [modification, setModification] = useState([]);
  const [conflict, setConflict] = useState([]);

  const filteredStudent =
    query === ""
      ? studentList
      : studentList.filter((item) => {
          const name = item.c_name.toLowerCase() || "";
          return name.includes(query.toLowerCase());
        });

  const filteredAsk =
    query === ""
      ? ask_student
      : ask_student.filter((item) => {
          const name = item.c_name.toLowerCase() || "";
          return name.includes(query.toLowerCase());
        });

  function checkItem() {
    if (type.current == 3) {
      sub();
    } else if (type.current == 4) {
      adj();
    }
  }

  // 調課
  async function sub() {
    getEndTime();
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        tutoring_course_id: course.tutoring_course_id,
        tutoring_course_status_id: 3,
        changed_date: select.course_date,
        changed_start_time: select.start_time,
        changed_end_time: select.end_time,
        remark: select.remark
      })
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/course_schedule/modification/${course_schedule_id.current}/sub`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "調課完成，課程跳轉！"
      });
      window.location.href = `/admin/course?id=${res.id}`;
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  // 補課
  async function adj() {
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        course_date: select.course_date,
        start_time: select.start_time,
        end_time: select.end_time,
        remark: select.remark
      })
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/course_schedule/modification/adj?course_schedule_id=${course_schedule_id.current}`, config);
    const res = await response.json();
    if (response.ok) {
      window.location.href = `/admin/course?id=${res.id}`;
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  function getData(id) {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        user_id: localStorage.getItem("user_id"),
        "Content-Type": "application/json"
      }
    };
    // 學生資料
    const api1 = fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/student/list?student_status_id=1`, config);
    const api2 = fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/course_schedule_student/list?schedule_id=${id}`, config);
    const api3 = fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/preparation/course/list`, config);
    // 課程資料
    const api4 = fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/course_schedule/${id}`, config);
    const api5 = fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/course_schedule/modification/${id}`, config);
    const api6 = fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/course_schedule_teacher/oneday/${id}`, config);

    Promise.all([api1, api2, api3, api4, api5, api6])
      .then(async ([response1, response2, response3, response4, response5, response6]) => {
        const res1 = await response1.json();
        const res2 = await response2.json();
        const res3 = await response3.json();
        const res4 = await response4.json();
        const res5 = await response5.json();
        const res6 = await response6.json();

        if (!response1.ok) {
          const msg = error(response1.status, res1);
          setInfo({
            show: true,
            success: false,
            msg: "錯誤" + msg
          });
        } else {
          setStudentList(
            res1.list.map((i) => {
              return {
                schedule_id: id,
                student_id: i.id,
                c_name: i.user.first_name,
                e_name: i.user.nick_name,
                status: 2,
                source_type: 2,
                leave_type: 1
              };
            })
          );
        }

        if (!response2.ok) {
          const msg = error(response2.status, res2);
          setInfo({
            show: true,
            success: false,
            msg: "錯誤" + msg
          });
        } else {
          setSchedule_student(res2.list);
        }

        if (!response3.ok) {
          const msg = error(response3.status, res3);
          setInfo({
            show: true,
            success: false,
            msg: "錯誤" + msg
          });
        } else {
          setAsk_student(
            res3
              .filter((i) => !i.isclose)
              .map((i) => {
                return {
                  schedule_id: id,
                  c_name: i.chinese_name,
                  e_name: i.english_name,
                  ask_student_id: i.id,
                  status: 3,
                  source_type: 2,
                  leave_type: 1
                };
              })
          );
        }

        if (!response4.ok) {
          const msg = error(response4.status, res4);
          setInfo({
            show: true,
            success: false,
            msg: "錯誤" + msg
          });
        } else {
          setCourse(res4);
        }

        if (!response5.ok) {
          const msg = error(response5.status, res5);
          setInfo({
            show: true,
            success: false,
            msg: "錯誤" + msg
          });
        } else {
          setModification(res5.list);
        }

        if (!response6.ok) {
          const msg = error(response6.status, res6);
          setInfo({
            show: true,
            success: false,
            msg: "錯誤" + msg
          });
        } else {
          setSchedule_teacher(res6);
        }
      })
      .finally(setLoading(false));
  }

  async function add_student(item) {
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(item)
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/course_schedule_student/add`, config);
    const res = await response.json();
    if (response.ok) {
      getData(course_schedule_id.current);
      setInfo({
        show: true,
        success: true,
        msg: "修改成功！"
      });
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function delete_student(item) {
    const config = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/course_schedule_student/${item.id}/remove`, config);
    const res = await response.json();
    if (response.ok) {
      getData(course_schedule_id.current);
      setInfo({
        show: true,
        success: true,
        msg: "修改成功！"
      });
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function delete_teacher(item) {
    const config = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/course_schedule_teacher/${item.id}/remove`, config);
    const res = await response.json();
    if (response.ok) {
      getData(course_schedule_id.current);
      setInfo({
        show: true,
        success: true,
        msg: "修改成功！"
      });
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function update_teacher() {
    const config = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(teacherUpdate)
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/course_schedule_teacher/${teacherUpdate.tcst_id}/update`, config);
    const res = await response.json();
    if (response.ok) {
      getData(course_schedule_id.current);
      setInfo({
        show: true,
        success: true,
        msg: "請假完成！"
      });
      setOpen4(false);
      setTeacherUpdate(def_update);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  function getEndTime() {
    const h = course.class_hours;
    // 將時間字串轉換為 Date 對象
    let [hours, minutes] = select.start_time.split(":").map(Number);
    let date = new Date();
    date.setHours(hours, minutes, 0, 0); // 設置時間為 startTime 對應的時間

    // 增加指定的分鐘數
    date.setTime(date.getTime() + h * 60 * 1000);

    // 取得新的小時和分鐘，並格式化成 "HH:mm"
    let newHours = String(date.getHours()).padStart(2, "0");
    let newMinutes = String(date.getMinutes()).padStart(2, "0");

    select.end_time = `${newHours}:${newMinutes}`;
  }

  async function getConflict() {
    const teacher = schedule_teacher?.filter((i) => i.teacher_id != null);
    const student = schedule_student?.filter((i) => i.student_id != null);
    if (type.current == 3) {
      getEndTime();
    }
    if (!select.course_date) {
      setInfo({
        show: true,
        success: false,
        msg: "請填寫日期"
      });
      return;
    }
    if (!select.start_time || !select.end_time) {
      setInfo({
        show: true,
        success: false,
        msg: "請填寫時間"
      });
      return;
    }
    // return;
    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        teacher: teacher.map((i) => i.teacher_id),
        student: student.map((i) => i.student_id),
        start: select.course_date,
        end: select.course_date,
        start_time: select.start_time,
        end_time: select.end_time
      })
    };
    const response = await fetch(`/api/conflict`, config);
    const res = await response.json();
    if (response.ok) {
      setConflict(res);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "查詢錯誤"
      });
    }
  }

  useEffect(() => {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const id = params.get("id");
    course_schedule_id.current = id;
    getData(id);
  }, []);

  const modificationTime = modification?.reduce((accumulator, item) => accumulator + item.class_hours, 0) || 0;
  return (
    <>
      <Alert
        info={info}
        setInfo={setInfo}
      />
      {/* 課程紀錄 */}
      <Dialog
        open={modificationDialog}
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
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-4xl sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <ul
                role="list"
                className="divide-y divide-gray-200"
              >
                <li className="py-4 flex font-medium grid grid-cols-12">
                  <div className="col-span-2">上課日期</div>
                  <div className="col-span-2">原訂日期</div>
                  <div className="col-span-2">狀態</div>
                  <div className="col-span-3">原因</div>
                  <div className="col-span-1">查看</div>
                  <div className="col-span-1 text-right">補課時數</div>
                </li>
                {modification.map((item, index) => (
                  <li
                    key={index}
                    className="py-4 flex grid grid-cols-12"
                  >
                    <div className="col-span-2">{item.changed_date}</div>
                    <div className="col-span-2">{item.make_up_course_date}</div>
                    <div
                      className="col-span-2"
                      style={{
                        color:
                          item.tutoring_course_status_id == 1
                            ? "#FCFCFC"
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
                    >
                      {item.status_name}
                    </div>
                    <div className="col-span-3">{item.remark}</div>
                    <div className="col-span-1">
                      {item.tutoring_course_status_id == 5 ? (
                        item.src_schedule_id ? (
                          <a
                            className="text-blue-400"
                            href={`/admin/course?id=${item.src_schedule_id}`}
                          >
                            查詢來源
                          </a>
                        ) : (
                          <a
                            className="text-blue-400"
                            href={`/admin/course?id=${item.to_schedule_id}`}
                          >
                            查詢課程
                          </a>
                        )
                      ) : null}
                    </div>
                    <div className={`${item.class_hours > 0 ? "text-red-300" : "text-green-300"} col-span-1 text-right`}>{item.class_hours}</div>
                  </li>
                ))}
                <li className="py-4 flex font-medium grid grid-cols-12">
                  <div className="col-span-2"></div>
                  <div className="col-span-2"></div>
                  <div className="col-span-3"></div>
                  <div className="col-span-1"></div>
                  <div className="col-span-2">剩餘補課時數：</div>
                  <div className={`${modificationTime > 0 ? "text-red-300" : "text-green-300"} col-span-1 text-right`}>{modificationTime}</div>
                </li>
              </ul>
              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setModificationDialog(false);
                  }}
                  className="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold ring-2"
                >
                  關閉
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      {/* 課程調整 */}
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
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-2xl sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div className="text-center text-2xl text-blue-400">{type.current == 3 ? "調課" : type.current == 4 ? "補課" : ""}</div>
              <div className="grid grid-cols-2 mt-2">
                <div className="col-span-1 row-span-3">
                  <label className="block text-sm font-medium leading-6 text-gray-900">日期</label>
                  <div className="flex justify-center">
                    {" "}
                    <Calendar
                      value={select.course_date}
                      onChange={(value) => {
                        if (value) {
                          setSelect({
                            ...select,
                            course_date: value.format("YYYY-MM-DD")
                          });
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="col-span-1">
                  <label className="block text-sm/6 font-medium text-gray-900 text-left">起始時間</label>
                  <div className="flex">
                    <select
                      value={select.s_h}
                      onChange={(e) => {
                        setSelect({
                          ...select,
                          s_h: e.target.value,
                          start_time: `${e.target.value.padStart(2, "0")}:${select.s_m.toString().padStart(2, "0")}`
                        });
                      }}
                      className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm/6"
                    >
                      {Array.from({ length: 14 }, (_, index) => {
                        return (
                          <option
                            key={index + 9}
                            value={index + 9}
                          >
                            {index + 9}時
                          </option>
                        );
                      })}
                    </select>
                    <select
                      value={select.s_m}
                      onChange={(e) => {
                        setSelect({
                          ...select,
                          s_m: e.target.value,
                          start_time: `${select.s_h.toString().padStart(2, "0")}:${e.target.value.padStart(2, "0")}`
                        });
                      }}
                      className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm/6"
                    >
                      {Array.from({ length: 6 }, (_, index) => {
                        return (
                          <option
                            key={index * 10}
                            value={index * 10}
                          >
                            {index * 10}分
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                {type.current == 4 && (
                  <div className="col-span-1">
                    <label className="block text-sm/6 font-medium text-gray-900 text-left">結束時間</label>
                    <div className="flex">
                      <select
                        value={select.e_h}
                        onChange={(e) => {
                          setSelect({
                            ...select,
                            e_h: e.target.value,
                            end_time: `${e.target.value.padStart(2, "0")}:${select.e_m.toString().padStart(2, "0")}`
                          });
                        }}
                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm/6"
                      >
                        {Array.from({ length: 14 }, (_, index) => {
                          return (
                            <option
                              key={index + 9}
                              value={index + 9}
                            >
                              {index + 9}時
                            </option>
                          );
                        })}
                      </select>
                      <select
                        value={select.e_m}
                        onChange={(e) => {
                          setSelect({
                            ...select,
                            e_m: e.target.value,
                            end_time: `${select.e_h.toString().padStart(2, "0")}:${e.target.value.padStart(2, "0")}`
                          });
                        }}
                        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm/6"
                      >
                        {Array.from({ length: 6 }, (_, index) => {
                          return (
                            <option
                              key={index * 10}
                              value={index * 10}
                            >
                              {index * 10}分
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                )}

                <div className="col-span-1">
                  <label className="block text-sm font-medium leading-6 text-gray-900">原因</label>
                  <div className="mt-2">
                    <textarea
                      value={select.remark}
                      onChange={(e) => {
                        setSelect({ ...select, remark: e.target.value });
                      }}
                      rows={4}
                      className="p-2 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300"
                    />
                  </div>
                </div>
                <div className="col-span-2 my-2 border-2 border-pink-400 rounded-md py-1 px-2">
                  <div className="flex items-center justify-around">
                    <label className="block text-sm font-medium leading-6 text-gray-900">衝堂顯示</label>
                    <div>
                      <button
                        type="button"
                        onClick={() => {
                          getConflict();
                        }}
                        className="inline-flex justify-center rounded-md bg-pink-600 px-2 py-1 text-sm text-white shadow-sm hover:bg-pink-900"
                      >
                        查詢衝堂
                      </button>
                    </div>
                  </div>
                  <table className="w-full mt-2 text-sm">
                    <thead>
                      <tr className="divide-x divide-gray-600 bg-pink-200">
                        <th className="text-center font-semibold text-gray-900">名稱</th>
                        <th className="text-center font-semibold text-gray-900">課程</th>
                        <th className="text-center font-semibold text-gray-900">起始</th>
                        <th className="text-center font-semibold text-gray-900">結束</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {conflict.teacher?.map((i, index) => (
                        <tr
                          key={index}
                          className="text-center hover:bg-pink-100"
                        >
                          <td className="text-orange-500">{i.c_name}(老師)</td>
                          <td className="text-gray-500">{i.course_name}</td>
                          <td className="text-gray-500">{i.start_time.substr(0, 5)}</td>
                          <td className="text-gray-500">{i.end_time.substr(0, 5)}</td>
                        </tr>
                      ))}
                      {conflict.student?.map((i, index) => (
                        <tr
                          key={index}
                          className="text-center hover:bg-pink-100"
                        >
                          <td className="text-gray-500 font-medium">{i.c_name}</td>
                          <td className="text-gray-500">{i.course_name}</td>
                          <td className="text-gray-500">{i.start_time.substr(0, 5)}</td>
                          <td className="text-gray-500">{i.end_time.substr(0, 5)}</td>
                        </tr>
                      ))}
                      {conflict.teacher?.length == 0 && conflict.student?.length == 0 && (
                        <tr className="text-center">
                          <td
                            colSpan={4}
                            className="text-xl text-pink-500 font-medium"
                          >
                            無衝堂
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                  }}
                  className="mx-2 inline-flex justify-center rounded-md bg-gray-600 px-3 py-2 text-sm text-white hover:bg-gray-400"
                >
                  關閉
                </button>
                <button
                  type="button"
                  onClick={() => {
                    checkItem();
                    setOpen(false);
                  }}
                  className="mx-2 inline-flex justify-center rounded-md bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-400"
                >
                  確認
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      {/* 老師請假 */}
      <Dialog
        open={open4}
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
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-md sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2">
                  <label className="block text-sm/6 font-medium text-gray-900">假別</label>
                  <select
                    value={teacherUpdate.leave_type}
                    onChange={(e) => {
                      setTeacherUpdate({
                        ...teacherUpdate,
                        leave_type: Number(e.target.value)
                      });
                    }}
                    className="p-2 block w-full rounded-md border-0 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm/6"
                  >
                    <option value={0}></option>
                    <option value={2}>事假</option>
                    <option value={3}>病假</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm/6 font-medium text-gray-900">原因</label>
                  <textarea
                    value={teacherUpdate.leave_reason}
                    onChange={(e) => {
                      setTeacherUpdate({
                        ...teacherUpdate,
                        leave_reason: e.target.value
                      });
                    }}
                    rows={3}
                    className="p-2 block w-full rounded-md border-0 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm/6"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm/6 font-medium text-gray-900 text-left">起始時間</label>
                  <div className="flex">
                    <select
                      value={teacherUpdate.s_h}
                      onChange={(e) => {
                        setTeacherUpdate({
                          ...teacherUpdate,
                          s_h: e.target.value,
                          leave_start_time: `${e.target.value.padStart(2, "0")}:${teacherUpdate.s_m.toString().padStart(2, "0")}`
                        });
                      }}
                      className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm/6"
                    >
                      {Array.from({ length: 14 }, (_, index) => {
                        return (
                          <option
                            key={index + 9}
                            value={index + 9}
                          >
                            {index + 9}時
                          </option>
                        );
                      })}
                    </select>
                    <select
                      value={teacherUpdate.s_m}
                      onChange={(e) => {
                        setTeacherUpdate({
                          ...teacherUpdate,
                          s_m: e.target.value,
                          leave_start_time: `${teacherUpdate.s_h.toString().padStart(2, "0")}:${e.target.value.padStart(2, "0")}`
                        });
                      }}
                      className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm/6"
                    >
                      {Array.from({ length: 6 }, (_, index) => {
                        return (
                          <option
                            key={index * 10}
                            value={index * 10}
                          >
                            {index * 10}分
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
                <div className="col-span-1">
                  <label className="block text-sm/6 font-medium text-gray-900 text-left">結束時間</label>
                  <div className="flex">
                    <select
                      value={teacherUpdate.e_h}
                      onChange={(e) => {
                        setTeacherUpdate({
                          ...teacherUpdate,
                          e_h: e.target.value,
                          leave_end_time: `${e.target.value.padStart(2, "0")}:${teacherUpdate.e_m.toString().padStart(2, "0")}`
                        });
                      }}
                      className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm/6"
                    >
                      {Array.from({ length: 14 }, (_, index) => {
                        return (
                          <option
                            key={index + 9}
                            value={index + 9}
                          >
                            {index + 9}時
                          </option>
                        );
                      })}
                    </select>
                    <select
                      value={teacherUpdate.e_m}
                      onChange={(e) => {
                        setTeacherUpdate({
                          ...teacherUpdate,
                          e_m: e.target.value,
                          leave_end_time: `${teacherUpdate.e_h.toString().padStart(2, "0")}:${e.target.value.padStart(2, "0")}`
                        });
                      }}
                      className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm/6"
                    >
                      {Array.from({ length: 6 }, (_, index) => {
                        return (
                          <option
                            key={index * 10}
                            value={index * 10}
                          >
                            {index * 10}分
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </div>
              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setOpen4(false);
                  }}
                  className="mx-1 inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold ring-2 ring-gray-400"
                >
                  關閉
                </button>
                <button
                  type="button"
                  onClick={update_teacher}
                  className="mx-1 inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold ring-2 text-green-600 ring-green-600"
                >
                  送出
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      <div className="container mx-auto p-2">
        {loading ? (
          <div className="flex justify-center items-center mt-40">
            <div className="spinner"></div>
            <span className="mx-4 text-blue-500">資料讀取中...</span>
          </div>
        ) : (
          <>
            <div className="bg-white ring-1 ring-gray-900/5 rounded-xl mb-2">
              <div className="grid grid-cols-4 gap-3 text-center px-3 py-2">
                <div className="col-span-1 font-semibold text-blue-400">
                  <span className="mx-2 text-xl">{course.course_name}</span>
                  <span className="col-span-1 font-semibold text-red-400 content-center">
                    {course.tutoring_course_status_id == 1 || course.tutoring_course_status_id == 7
                      ? "正常上課"
                      : course.tutoring_course_status_id == 2
                      ? "停課(不補課)"
                      : course.tutoring_course_status_id == 3
                      ? "調課"
                      : course.tutoring_course_status_id == 4
                      ? "停課(需補課)"
                      : course.tutoring_course_status_id == 5
                      ? "補課"
                      : course.tutoring_course_status_id == 6
                      ? "加課"
                      : ""}
                  </span>
                </div>
                <div className="col-span-1 content-center">
                  <span className="mx-2 text-lg">{course.course_date}</span>
                  <span className="mx-2 text-gray-400 text-sm">
                    {course.start_time?.substr(0, 5)} ~ {course.end_time?.substr(0, 5)}
                  </span>
                </div>
                <div className="col-span-1">{course.classroom_name}</div>
                <div className="col-span-1 row-span-3 border-2 rounded-md">
                  {schedule_teacher.map((person) => {
                    return (
                      <div
                        key={person.id}
                        onDoubleClick={() => {
                          const check = confirm(`確定要移除 ${person.c_name} 嗎？`);
                          if (check) {
                            delete_teacher(person);
                          }
                        }}
                        className={`${person.leave_type == 1 ? "" : "bg-orange-100"} grid grid-cols-4 py-3 items-end hover:bg-blue-100 cursor-pointer`}
                      >
                        {person.status == 1 ? (
                          <>
                            <div className="col-span-1">
                              <span
                                onClick={() => {
                                  const s = course.start_time.split(":");
                                  const e = course.end_time.split(":");
                                  setTeacherUpdate({
                                    ...teacherUpdate,
                                    tcst_id: person.id,
                                    s_h: s[0],
                                    s_m: s[1],
                                    e_h: e[0],
                                    e_m: e[1],
                                    leave_start_time: `${s[0]}:${s[1]}`,
                                    leave_end_time: `${e[0]}:${e[1]}`
                                  });
                                  setOpen4(true);
                                }}
                                className="text-md text-pink-600 font-semibold hover:text-pink-900"
                              >
                                {person.c_name}
                              </span>
                            </div>
                            <div className="col-span-1 text-sm text-pink-400">{person.leave_type == 1 ? person.content : "請假"}</div>
                            {person.leave_type != 1 ? (
                              <div className="col-span-2 text-sm text-gray-600">
                                {person.leave_start_time?.substr(0, 5)}~{person.leave_end_time?.substr(0, 5)}
                              </div>
                            ) : null}
                          </>
                        ) : (
                          <>
                            <div className="col-span-1">
                              <span
                                onClick={() => {
                                  const s = course.start_time.split(":");
                                  const e = course.end_time.split(":");
                                  setTeacherUpdate({
                                    ...teacherUpdate,
                                    tcst_id: person.id,
                                    s_h: s[0],
                                    s_m: s[1],
                                    e_h: e[0],
                                    e_m: e[1],
                                    leave_start_time: `${s[0]}:${s[1]}`,
                                    leave_end_time: `${e[0]}:${e[1]}`
                                  });
                                  setOpen4(true);
                                }}
                                className="text-md text-gray-600 font-semibold hover:text-pink-900"
                              >
                                {person.c_name}
                              </span>
                            </div>
                            <div className="col-span-1 text-sm text-gray-400">{person.leave_type == 1 ? person.content : "請假"}</div>
                            {person.leave_type == 1 ? (
                              <div className="col-span-2 text-sm text-gray-600">
                                {person.course_start_time?.substr(0, 5)}~{person.course_end_time?.substr(0, 5)}
                              </div>
                            ) : (
                              <div className="col-span-2 text-sm text-gray-600">
                                {person.leave_start_time?.substr(0, 5)}~{person.leave_end_time?.substr(0, 5)}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="col-span-3 flex justify-around">
                  <span>
                    {course.tutoring_course_status_id == 2 || course.tutoring_course_status_id == 4 ? (
                      <>
                        {(course.tutoring_course_status_id == 2 || modificationTime == course.class_hours) && (
                          <span className="isolate inline-flex rounded-md shadow-sm mx-1">
                            <Resetcourse
                              schedule_id={course_schedule_id.current}
                              setInfo={setInfo}
                              getData={getData}
                            />
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="isolate inline-flex rounded-md shadow-sm mx-1">
                        <Stopcourse
                          schedule_id={course_schedule_id.current}
                          setInfo={setInfo}
                          getData={getData}
                        />
                      </span>
                    )}

                    {(course.tutoring_course_status_id == 1 || course.tutoring_course_status_id == 3) && (
                      <span className="isolate inline-flex rounded-md shadow-sm mx-1">
                        <button
                          onClick={() => {
                            type.current = 3;
                            setOpen(true);
                          }}
                          type="button"
                          className="relative inline-flex items-center rounded-md bg-white px-1.5 py-1 text-md font-semibold text-gray-900 ring-1 ring-inset ring-gray-300"
                        >
                          調課
                        </button>
                      </span>
                    )}

                    {modificationTime > 0 && (
                      <span className="isolate inline-flex rounded-md shadow-sm mx-1">
                        <button
                          onClick={() => {
                            type.current = 4;
                            setOpen(true);
                          }}
                          type="button"
                          className="relative inline-flex rounded-md items-center bg-white px-1.5 py-1 text-md font-semibold text-gray-900 ring-1 ring-inset ring-gray-300"
                        >
                          補課
                        </button>
                      </span>
                    )}

                    <span className="isolate inline-flex rounded-md shadow-sm mx-1">
                      <Changedclassroom
                        course={course}
                        schedule_id={course_schedule_id.current}
                        setInfo={setInfo}
                        getData={getData}
                      />
                    </span>

                    <span className="isolate inline-flex rounded-md shadow-sm mx-1">
                      <Changedteacher
                        course={course}
                        schedule_id={course_schedule_id.current}
                        setInfo={setInfo}
                        getData={getData}
                      />
                    </span>
                  </span>

                  <span>
                    <span className="isolate inline-flex rounded-md shadow-sm mx-1">
                      <button
                        onClick={() => {
                          setModificationDialog(true);
                        }}
                        type="button"
                        className="relative inline-flex items-center rounded-md bg-blue-100 px-1.5 py-1 text-md font-semibold text-gray-900 ring-1 ring-inset ring-gray-300"
                      >
                        紀錄
                      </button>
                    </span>

                    <span className="isolate inline-flex rounded-md shadow-sm mx-1">
                      <Calender
                        teacher={schedule_teacher?.filter((i) => i.teacher_id != null)}
                        student={schedule_student?.filter((i) => i.student_id != null)}
                      />
                    </span>

                    <span className="isolate inline-flex rounded-md shadow-sm mx-1">
                      <button
                        onClick={() => {
                          window.location.href = `/admin/schedule/weekclass?id=${course.tutoring_course_id}`;
                        }}
                        type="button"
                        className="relative inline-flex items-center rounded-md bg-orange-100 px-1.5 py-1 text-md font-semibold text-gray-900 ring-1 ring-inset ring-gray-300"
                      >
                        定期
                      </button>
                    </span>
                  </span>
                </div>
                <div className="col-span-3 border rounded-md m-1 h-60 overflow-auto">
                  <div className="text-center py-1 bg-gray-200 sticky top-0">
                    <div className="text-md">學生</div>
                  </div>
                  <div className="grid grid-cols-4">
                    {schedule_student.map((i, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          if (i.source_type != 1) {
                            if (i.student_id) {
                              setSchedule_student(schedule_student.filter((j) => j.student_id != i.student_id));
                            } else {
                              setSchedule_student(schedule_student.filter((j) => j.ask_student_id != i.ask_student_id));
                            }
                            delete_student(i);
                          }
                        }}
                        className={`${i.source_type == 1 ? "" : "hover:border-blue-400 cursor-pointer"} border m-1 rounded-md flex justify-between p-1 text-sm`}
                      >
                        <div className="flex justify-between items-end">
                          <span className={`${i.status == 1 ? "text-blue-500 border-blue-200" : "text-red-500 border-red-200"} border rounded-xl px-1`}>
                            {i.status == 1 ? "原班生" : i.status == 2 ? "舊試聽" : "新試聽"}
                          </span>
                          <div className="mx-2">
                            <span className="font-bold">{i.c_name}</span>
                            <span className="text-gray-500">{i.e_name}</span>
                          </div>
                        </div>
                        <div className="flex">{i.source_type == 2 && <XCircleIcon className="w-6 h-6 text-red-400" />}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white ring-1 ring-gray-900/5 rounded-xl p-2">
              <div className="relative rounded-md shadow-sm my-1">
                <input
                  onChange={(event) => setQuery(event.target.value)}
                  value={query}
                  type="text"
                  placeholder="姓名"
                  className="p-1 block w-full rounded-md pr-10 text-gray-900 ring-1 ring-inset ring-sky-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <MagnifyingGlassIcon
                    aria-hidden="true"
                    className="h-5 w-5 text-gray-400"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 h-80 overflow-auto">
                  <div className="text-center py-1 bg-gray-200 sticky top-0">
                    <div className="text-md">一般生</div>
                  </div>
                  <div className="grid grid-cols-2 gap-1 p-1">
                    {filteredStudent
                      .filter((i) => !schedule_student?.some((j) => i.student_id == j.student_id))
                      .map((i, index) => (
                        <div
                          key={index}
                          className="border px-2 py-1 rounded-md flex justify-between text-sm hover:bg-yellow-50"
                        >
                          <div className="flex w-2/5">
                            <span className="font-bold">{i.c_name}</span>
                            <span className="text-gray-500">（{i.e_name}）</span>
                          </div>
                          <div className="flex w-2/5">
                            <span
                              onClick={() => {
                                i.status = 1;
                                setSchedule_student([...schedule_student, { ...i, status: 1 }]);
                                add_student(i);
                              }}
                              className="mx-1 font-bold ring-1 px-2 hover:bg-sky-200 cursor-pointer rounded-sm"
                            >
                              一般
                            </span>
                            <span
                              onClick={() => {
                                setSchedule_student([...schedule_student, i]);
                                add_student(i);
                              }}
                              className="text-gray-500 ring-1 px-2 hover:bg-sky-200 cursor-pointer rounded-sm"
                            >
                              試聽
                            </span>
                          </div>
                          <PlusCircleIcon className="w-5 h-5 text-green-400" />
                        </div>
                      ))}
                  </div>
                </div>
                <div className="col-span-1 h-80 overflow-auto">
                  <div className="text-center py-1 bg-gray-200 sticky top-0">
                    <div className="text-md">問班生</div>
                  </div>
                  {filteredAsk
                    .filter((i) => !schedule_student?.some((j) => i.ask_student_id == j.ask_student_id))
                    .map((i, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setSchedule_student([...schedule_student, i]);
                          add_student(i);
                        }}
                        className="border p-1 m-1 rounded-md flex justify-between hover:border-blue-400 cursor-pointer text-sm"
                      >
                        <div className="flex justify-between">
                          <span className="font-bold">{i.c_name}</span>
                          <span className="text-gray-500">（{i.e_name}）</span>
                        </div>
                        <PlusCircleIcon className="w-5 h-5 text-green-400" />
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
