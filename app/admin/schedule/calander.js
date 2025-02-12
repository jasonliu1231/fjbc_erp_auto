"use client";

import { useEffect, useState } from "react";
import { CheckIcon, CalendarIcon } from "@heroicons/react/20/solid";
import { TutoringSelect, SchoolYear, Semester, CourseExtend, Week, Course, Classroom, Teacher } from "./select";
import { error } from "../../utils";

export default function Example({ setInfo }) {
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState({});
  const [dateRange, setDateRange] = useState([]);
  const [result, setResult] = useState(false);

  function rangeDate(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dateArray = [];

    // 生成日期區間
    let currentDate = start;
    while (currentDate <= end) {
      dateArray.push(new Date(currentDate).toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    setDateRange(dateArray);
  }

  async function addItems() {
    if (!selected.school_year) {
      setInfo({ show: true, success: false, msg: "請填寫上課日期" });
      return;
    }
    if (!selected.semester) {
      setInfo({ show: true, success: false, msg: "請填寫上課日期" });
      return;
    }
    if (!selected.tutoring_id) {
      setInfo({ show: true, success: false, msg: "請填寫上課日期" });
      return;
    }
    if (!selected.start_date) {
      setInfo({ show: true, success: false, msg: "請填寫上課時間" });
      return;
    }
    if (!selected.end_date) {
      setInfo({ show: true, success: false, msg: "請填寫下課時間" });
      return;
    }
    rangeDate(selected.start_date, selected.end_date);
    console.log(selected);

    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(selected)
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/course_time/${selected.tutoring_id}`, config);
    const res = await response.json();
    if (response.ok) {
      setList(res.list);
      setResult(true);
    } else {
      //   const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + res.detail
      });
      setResult(false);
    }
  }

  const Mon = list.filter((i) => i.course_date == dateRange[0]);
  const Tue = list.filter((i) => i.course_date == dateRange[1]);
  const Wed = list.filter((i) => i.course_date == dateRange[2]);
  const Thu = list.filter((i) => i.course_date == dateRange[3]);
  const Fri = list.filter((i) => i.course_date == dateRange[4]);
  const Sat = list.filter((i) => i.course_date == dateRange[5]);
  const Sun = list.filter((i) => i.course_date == dateRange[6]);

  return (
    <>
      <div className="my-2 grid grid-cols-4 lg:grid-cols-12">
        <div className="col-span-1">
          <SchoolYear setInput={setSelected} />
        </div>
        <div className="col-span-2">
          <Semester setInput={setSelected} />
        </div>
        <div className="col-span-4">
          <TutoringSelect setInput={setSelected} />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-semibold leading-6 text-red-500">起始</label>
          <div className="mt-2">
            <input
              value={selected?.start_date || ""}
              onChange={(event) => {
                setSelected({
                  ...selected,
                  start_date: event.target.value
                });
              }}
              type="date"
              className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-semibold leading-6 text-red-500">結束</label>
          <div className="mt-2">
            <input
              value={selected?.end_date || ""}
              onChange={(event) => {
                setSelected({
                  ...selected,
                  end_date: event.target.value
                });
              }}
              type="date"
              className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="col-span-1 flex justify-center items-center">
          <button
            onClick={addItems}
            type="button"
            className="rounded-md bg-green-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          >
            新增
          </button>
        </div>
      </div>
      {result && (
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-7">
          <div className="col-span-1">
            <ul
              role="list"
              className="divide-y divide-gray-200 mx-1"
            >
              <li className="py-2 flex justify-center bg-gray-700 text-gray-200">{dateRange[0]}</li>
              {Mon.map((item, index) => {
                return (
                  <li
                    key={index}
                    className="py-2 cursor-pointer hover:bg-gray-200"
                  >
                    <div className="p-1">
                      <div className="text-lg flex items-center">{item.course_name || ""}</div>
                      <p className="flex items-center text-sm text-gray-500">
                        <CalendarIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                        {item.start_time}~{item.end_time}
                      </p>
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
              <li className="py-2 flex justify-center bg-gray-700 text-gray-200">{dateRange[1]}</li>
              {Tue.map((item, index) => {
                return (
                  <li
                    key={index}
                    className="py-2 cursor-pointer hover:bg-gray-200"
                  >
                    <div className="p-1">
                      <div className="text-lg flex items-center">{item.course_name || ""}</div>
                      <p className="flex items-center text-sm text-gray-500">
                        <CalendarIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                        {item.start_time} ~ {item.end_time}
                      </p>
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
              <li className="py-2 flex justify-center bg-gray-700 text-gray-200">{dateRange[2]}</li>
              {Wed.map((item, index) => {
                return (
                  <li
                    key={index}
                    className="py-2 cursor-pointer hover:bg-gray-200"
                  >
                    <div className="p-1">
                      <div className="text-lg flex items-center">{item.course_name || ""}</div>
                      <p className="flex items-center text-sm text-gray-500">
                        <CalendarIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                        {item.start_time} ~ {item.end_time}
                      </p>
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
              <li className="py-2 flex justify-center bg-gray-700 text-gray-200">{dateRange[3]}</li>
              {Thu.map((item, index) => {
                return (
                  <li
                    key={index}
                    className="py-2 cursor-pointer hover:bg-gray-200"
                  >
                    <div className="p-1">
                      <div className="text-lg flex items-center">{item.course_name || ""}</div>
                      <p className="flex items-center text-sm text-gray-500">
                        <CalendarIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                        {item.start_time} ~ {item.end_time}
                      </p>
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
              <li className="py-2 flex justify-center bg-gray-700 text-gray-200">{dateRange[4]}</li>
              {Fri.map((item, index) => {
                return (
                  <li
                    key={index}
                    className="py-2 cursor-pointer hover:bg-gray-200"
                  >
                    <div className="p-1">
                      <div className="text-lg flex items-center">{item.course_name || ""}</div>
                      <p className="flex items-center text-sm text-gray-500">
                        <CalendarIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                        {item.start_time} ~ {item.end_time}
                      </p>
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
              <li className="py-2 flex justify-center bg-gray-700 text-gray-200">{dateRange[5]}</li>
              {Sat.map((item, index) => {
                return (
                  <li
                    key={index}
                    className="py-2 cursor-pointer hover:bg-gray-200"
                  >
                    <div className="p-1">
                      <div className="text-lg flex items-center">{item.course_name || ""}</div>
                      <p className="flex items-center text-sm text-gray-500">
                        <CalendarIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                        {item.start_time} ~ {item.end_time}
                      </p>
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
              <li className="py-2 flex justify-center bg-gray-700 text-gray-200">{dateRange[6]}</li>
              {Sun.map((item, index) => {
                return (
                  <li
                    key={index}
                    className="py-2 cursor-pointer hover:bg-gray-200"
                  >
                    <div className="p-1">
                      <div className="text-lg flex items-center">{item.course_name || ""}</div>
                      <p className="flex items-center text-sm text-gray-500">
                        <CalendarIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                        {item.start_time} ~ {item.end_time}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
