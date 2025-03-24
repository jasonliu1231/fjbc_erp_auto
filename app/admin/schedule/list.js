"use client";

import { useEffect, useState } from "react";
import { ArrowPathIcon, CalendarIcon } from "@heroicons/react/20/solid";
import { TutoringSelect, SchoolYear, Semester, CourseExtend, Week, Course, Classroom, Teacher } from "./select";
import { error } from "../../utils";

export default function Example({ setInfo }) {
  const [over, setOver] = useState(false);
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState({});
  const [teacher, setTeacher] = useState([]);
  const [selectTeacher, setSelectTeacher] = useState(0);

  async function getItemsList() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    let url = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/course_time/list?`;
    if (selected.tutoring_id) {
      url += `tutoring_id=${selected.tutoring_id}&`;
    }
    if (selected.school_year) {
      url += `school_year=${selected.school_year}&`;
    }
    if (selected.semester) {
      url += `semester=${selected.semester}&`;
    }
    const response = await fetch(url, config);
    const res = await response.json();
    if (response.ok) {
      setList(res.list);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  async function getTeacher() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    let url = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/teacher/list?show_exit=false`;
    const response = await fetch(url, config);
    const res = await response.json();
    if (response.ok) {
      setTeacher(res.list);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
  }

  const list2 = over
    ? list.filter((i) => {
        if (new Date(`${i.end_date} ${i.end_time}`) < new Date()) {
          return i;
        }
      })
    : list.filter((i) => {
        if (new Date(`${i.end_date} ${i.end_time}`) > new Date()) {
          return i;
        }
      });

  const list1 = selectTeacher == 0 ? list2 : list2.filter((i) => i.teacher_list.some((j) => j.id == selectTeacher));

  const Mon = list1.filter((i) => i.week == 0);
  const Tue = list1.filter((i) => i.week == 1);
  const Wed = list1.filter((i) => i.week == 2);
  const Thu = list1.filter((i) => i.week == 3);
  const Fri = list1.filter((i) => i.week == 4);
  const Sat = list1.filter((i) => i.week == 5);
  const Sun = list1.filter((i) => i.week == 6);

  useEffect(() => {
    getTeacher();
    getItemsList();
  }, [selected]);

  return (
    <>
      <div className="my-2 grid grid-cols-4 lg:grid-cols-12 items-end">
        <div className="col-span-2">
          <SchoolYear setInput={setSelected} />
        </div>
        <div className="col-span-2">
          <Semester setInput={setSelected} />
        </div>
        <div className="col-span-3">
          <TutoringSelect setInput={setSelected} />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium leading-6 text-gray-900">老師</label>
          <select
            onChange={(e) => {
              setSelectTeacher(e.target.value);
            }}
            className="mt-2 block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 leading-6"
          >
            <option></option>
            {teacher.map((i) => (
              <option
                key={i.id}
                value={i.id}
              >
                {i.user.first_name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-2 flex">
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
              setSelected({});
            }}
            type="button"
            className="mx-1 relative inline-flex rounded-md items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-inset ring-1 ring-gray-300 hover:bg-gray-50 focus:z-10"
          >
            <ArrowPathIcon className="w-5 h-5" />
          </button>
        </div>
        {/* <div className="col-span-1">
          <button
            onClick={() => {
              setSelected({});
            }}
            type="button"
            className="mx-1 relative inline-flex rounded-md items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-inset ring-1 ring-gray-300 hover:bg-gray-50 focus:z-10"
          >
            <ArrowPathIcon className="w-5 h-5" />
          </button>
        </div> */}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-7 bg-white shadow-sm ring-1 ring-gray-200 rounded-xl p-4 mt-4">
        <div className="col-span-1">
          <ul
            role="list"
            className="divide-y divide-gray-200 mx-1"
          >
            <li className="py-2 flex justify-center bg-gray-700 text-gray-200">星期一</li>
            {Mon.map((item, index) => {
              const start = item.start_time.split(":");
              const end = item.end_time.split(":");
              return (
                <li
                  key={index}
                  className="py-2"
                  onClick={() => {
                    window.location.href = `/admin/schedule/class?id=${item.id}`;
                  }}
                >
                  <div className="p-1 ring-2 rounded-md cursor-pointer hover:bg-gray-200">
                    <div className="flex justify-between">
                      <span className="mr-1 text-sm text-gray-500">{item.tutoring_course.school_year}學年</span>
                    </div>
                    <div className="text-md flex items-center justify-between w-full">
                      <span>
                        {item.tutoring_course.course.course_name}
                        {item.tutoring_course.course_name_extend}
                      </span>
                    </div>

                    <div className="text-sm text-gray-500">
                      {start[0]}:{start[1]} ~ {end[0]}:{end[1]}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="col-span-1">
          <ul
            role="list"
            className="divide-y divide-gray-200 mx-1"
          >
            <li className="py-2 flex justify-center bg-gray-700 text-gray-200">星期二</li>
            {Tue.map((item, index) => {
              const start = item.start_time.split(":");
              const end = item.end_time.split(":");
              return (
                <li
                  key={index}
                  className="py-2"
                  onClick={() => {
                    window.location.href = `/admin/schedule/class?id=${item.id}`;
                  }}
                >
                  <div className="p-1 ring-2 rounded-md cursor-pointer hover:bg-gray-200">
                    <div className="flex justify-between">
                      <span className="mr-1 text-sm text-gray-500">{item.tutoring_course.school_year}學年</span>
                    </div>
                    <div className="text-md flex items-center justify-between w-full">
                      <span>
                        {item.tutoring_course.course.course_name}
                        {item.tutoring_course.course_name_extend}
                      </span>
                    </div>

                    <div className="text-sm text-gray-500">
                      {start[0]}:{start[1]} ~ {end[0]}:{end[1]}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="col-span-1">
          <ul
            role="list"
            className="divide-y divide-gray-200 mx-1"
          >
            <li className="py-2 flex justify-center bg-gray-700 text-gray-200">星期三</li>
            {Wed.map((item, index) => {
              const start = item.start_time.split(":");
              const end = item.end_time.split(":");
              return (
                <li
                  key={index}
                  className="py-2"
                  onClick={() => {
                    window.location.href = `/admin/schedule/class?id=${item.id}`;
                  }}
                >
                  <div className="p-1 ring-2 rounded-md cursor-pointer hover:bg-gray-200">
                    <div className="flex justify-between">
                      <span className="mr-1 text-sm text-gray-500">{item.tutoring_course.school_year}學年</span>
                    </div>
                    <div className="text-md flex items-center justify-between w-full">
                      <span>
                        {item.tutoring_course.course.course_name}
                        {item.tutoring_course.course_name_extend}
                      </span>
                    </div>

                    <div className="text-sm text-gray-500">
                      {start[0]}:{start[1]} ~ {end[0]}:{end[1]}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="col-span-1">
          <ul
            role="list"
            className="divide-y divide-gray-200 mx-1"
          >
            <li className="py-2 flex justify-center bg-gray-700 text-gray-200">星期四</li>
            {Thu.map((item, index) => {
              const start = item.start_time.split(":");
              const end = item.end_time.split(":");
              return (
                <li
                  key={index}
                  className="py-2"
                  onClick={() => {
                    window.location.href = `/admin/schedule/class?id=${item.id}`;
                  }}
                >
                  <div className="p-1 ring-2 rounded-md cursor-pointer hover:bg-gray-200">
                    <div className="flex justify-between">
                      <span className="mr-1 text-sm text-gray-500">{item.tutoring_course.school_year}學年</span>
                    </div>
                    <div className="text-md flex items-center justify-between w-full">
                      <span>
                        {item.tutoring_course.course.course_name}
                        {item.tutoring_course.course_name_extend}
                      </span>
                    </div>

                    <div className="text-sm text-gray-500">
                      {start[0]}:{start[1]} ~ {end[0]}:{end[1]}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="col-span-1">
          <ul
            role="list"
            className="divide-y divide-gray-200 mx-1"
          >
            <li className="py-2 flex justify-center bg-gray-700 text-gray-200">星期五</li>
            {Fri.map((item, index) => {
              const start = item.start_time.split(":");
              const end = item.end_time.split(":");
              return (
                <li
                  key={index}
                  className="py-2"
                  onClick={() => {
                    window.location.href = `/admin/schedule/class?id=${item.id}`;
                  }}
                >
                  <div className="p-1 ring-2 rounded-md cursor-pointer hover:bg-gray-200">
                    <div className="flex justify-between">
                      <span className="mr-1 text-sm text-gray-500">{item.tutoring_course.school_year}學年</span>
                    </div>
                    <div className="text-md flex items-center justify-between w-full">
                      <span>
                        {item.tutoring_course.course.course_name}
                        {item.tutoring_course.course_name_extend}
                      </span>
                    </div>

                    <div className="text-sm text-gray-500">
                      {start[0]}:{start[1]} ~ {end[0]}:{end[1]}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="col-span-1">
          <ul
            role="list"
            className="divide-y divide-gray-200 mx-1"
          >
            <li className="py-2 flex justify-center bg-gray-700 text-gray-200">星期六</li>
            {Sat.map((item, index) => {
              const start = item.start_time.split(":");
              const end = item.end_time.split(":");
              return (
                <li
                  key={index}
                  className="py-2"
                  onClick={() => {
                    window.location.href = `/admin/schedule/class?id=${item.id}`;
                  }}
                >
                  <div className="p-1 ring-2 rounded-md cursor-pointer hover:bg-gray-200">
                    <div className="flex justify-between">
                      <span className="mr-1 text-sm text-gray-500">{item.tutoring_course.school_year}學年</span>
                    </div>
                    <div className="text-md flex items-center justify-between w-full">
                      <span>
                        {item.tutoring_course.course.course_name}
                        {item.tutoring_course.course_name_extend}
                      </span>
                    </div>

                    <div className="text-sm text-gray-500">
                      {start[0]}:{start[1]} ~ {end[0]}:{end[1]}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="col-span-1">
          <ul
            role="list"
            className="divide-y divide-gray-200 mx-1"
          >
            <li className="py-2 flex justify-center bg-gray-700 text-gray-200">星期日</li>
            {Sun.map((item, index) => {
              const start = item.start_time.split(":");
              const end = item.end_time.split(":");
              return (
                <li
                  key={index}
                  className="py-2"
                  onClick={() => {
                    window.location.href = `/admin/schedule/class?id=${item.id}`;
                  }}
                >
                  <div className="p-1 ring-2 rounded-md cursor-pointer hover:bg-gray-200">
                    <div className="flex justify-between">
                      <span className="mr-1 text-sm text-gray-500">{item.tutoring_course.school_year}學年</span>
                    </div>

                    <div className="text-md flex items-center justify-between w-full">
                      <span>
                        {item.tutoring_course.course.course_name}
                        {item.tutoring_course.course_name_extend}
                      </span>
                    </div>

                    <div className="text-sm text-gray-500">
                      {start[0]}:{start[1]} ~ {end[0]}:{end[1]}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}
