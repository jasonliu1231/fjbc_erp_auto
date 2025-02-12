"use client";

import { useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { error } from "../../utils";

const def_teacher = {
  s_h: "09",
  s_m: "00",
  e_h: "09",
  e_m: "00",
  course_start_time: "09:00",
  course_end_time: "09:00",
  status: 0,
  teacher_id: 0
};

export default function Home({ course, schedule_id, setInfo, getData }) {
  const [open, setOpen] = useState(false);
  const [teacherCreate, setTeacherCreate] = useState(def_teacher);
  const [teacherList, setTeacherList] = useState([]);
  const [teacherStateList, setTeacherStateList] = useState([]);

  async function getTeacher() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        user_id: localStorage.getItem("user_id"),
        "Content-Type": "application/json"
      }
    };
    const teacher = fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/teacher/list?show_exit=false`, config);
    const profile = fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/course_schedule_teacher/profile`, config);
    Promise.all([teacher, profile]).then(async ([response1, response2]) => {
      const res1 = await response1.json();
      const res2 = await response2.json();

      if (response1.ok) {
        setTeacherList(
          res1.list
            .filter((j) => j.user.is_active == true)
            .map((i) => {
              return {
                schedule_id: schedule_id,
                teacher_id: i.id,
                c_name: i.user.first_name,
                e_name: i.user.nick_name,
                status: 2,
                source_type: 2,
                leave_type: 1
              };
            })
        );
      } else {
        const msg = error(response1.status, res1);
        setInfo({
          show: true,
          success: false,
          msg: "錯誤" + msg
        });
      }

      if (response2.ok) {
        setTeacherStateList(res2.filter((i) => i.enable));
      } else {
        const msg = error(response2.status, res2);
        setInfo({
          show: true,
          success: false,
          msg: "錯誤" + msg
        });
      }

      setOpen(true);
    });
  }

  async function add_teacher() {
    if (teacherCreate.teacher_id == 0) {
      setInfo({
        show: true,
        success: false,
        msg: "請填寫老師"
      });
      return;
    }
    if (teacherCreate.status == 0) {
      setInfo({
        show: true,
        success: false,
        msg: "請填寫狀態"
      });
      return;
    }
    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(teacherCreate)
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/course_schedule_teacher/add`, config);
    const res = await response.json();
    if (response.ok) {
      getData(schedule_id);
      setInfo({
        show: true,
        success: true,
        msg: "修改成功！"
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

  return (
    <>
      {/* 新增老師 */}
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
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div className="grid grid-cols-2 gap-2">
                <div className="text-xl border-b-2 col-span-2">老師</div>
                <div className="col-span-1">
                  <label className="block text-sm/6 font-medium text-gray-900">老師</label>
                  <select
                    value={teacherCreate.teacher_id}
                    onChange={(e) => {
                      setTeacherCreate({
                        ...teacherCreate,
                        teacher_id: Number(e.target.value)
                      });
                    }}
                    className="p-2 block w-full rounded-md border-0 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm/6"
                  >
                    <option value={0}></option>
                    {teacherList.map((i) => {
                      return (
                        <option
                          key={i.teacher_id}
                          value={i.teacher_id}
                        >
                          {i.c_name}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="col-span-1">
                  <label className="block text-sm/6 font-medium text-gray-900">身份</label>
                  <select
                    value={teacherCreate.status}
                    onChange={(e) => {
                      setTeacherCreate({
                        ...teacherCreate,
                        status: Number(e.target.value)
                      });
                    }}
                    className="p-2 block w-full rounded-md border-0 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm/6"
                  >
                    <option value={0}></option>
                    {teacherStateList.map((i) => (
                      <option
                        key={i.id}
                        value={i.id}
                      >
                        {i.content}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-1">
                  <label className="block text-sm/6 font-medium text-gray-900 text-left">起始時間</label>
                  <div className="flex">
                    <select
                      value={teacherCreate.s_h}
                      onChange={(e) => {
                        setTeacherCreate({
                          ...teacherCreate,
                          s_h: e.target.value,
                          course_start_time: `${e.target.value.padStart(2, "0")}:${teacherCreate.s_m.toString().padStart(2, "0")}`
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
                      value={teacherCreate.s_m}
                      onChange={(e) => {
                        setTeacherCreate({
                          ...teacherCreate,
                          s_m: e.target.value,
                          course_start_time: `${teacherCreate.s_h.toString().padStart(2, "0")}:${e.target.value.padStart(2, "0")}`
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
                      value={teacherCreate.e_h}
                      onChange={(e) => {
                        setTeacherCreate({
                          ...teacherCreate,
                          e_h: e.target.value,
                          course_end_time: `${e.target.value.padStart(2, "0")}:${teacherCreate.e_m.toString().toString().padStart(2, "0")}`
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
                      value={teacherCreate.e_m}
                      onChange={(e) => {
                        setTeacherCreate({
                          ...teacherCreate,
                          e_m: e.target.value,
                          course_end_time: `${teacherCreate.e_h.toString().padStart(2, "0")}:${e.target.value.padStart(2, "0")}`
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
                      {/* {Array.from({ length: 6 }, (_, index) => {
                        return (
                          <option
                            key={index * 10}
                            value={index * 10}
                          >
                            {index * 10}分
                          </option>
                        );
                      })} */}
                    </select>
                  </div>
                </div>
              </div>
              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                  }}
                  className="mx-1 inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold ring-2 ring-gray-400"
                >
                  關閉
                </button>
                <button
                  type="button"
                  onClick={add_teacher}
                  className="mx-1 inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold ring-2 text-green-600 ring-green-600"
                >
                  新增
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
      <button
        onClick={() => {
          const s = course.start_time.split(":");
          const e = course.end_time.split(":");

          setTeacherCreate({
            ...teacherCreate,
            schedule_id: schedule_id,
            s_h: s[0],
            s_m: s[1],
            e_h: e[0],
            e_m: e[1],
            course_start_time: `${s[0]}:${s[1]}`,
            course_end_time: `${e[0]}:${e[1]}`
          });
          getTeacher();
        }}
        type="button"
        className="relative inline-flex items-center rounded-md bg-pink-100 px-1.5 py-1 text-md font-semibold text-gray-900 ring-1 ring-inset ring-gray-300"
      >
        新增老師
      </button>
    </>
  );
}
