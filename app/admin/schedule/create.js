"use client";

import { useRef, useState } from "react";
import { error, tutoringData } from "../../utils";
import { XCircleIcon } from "@heroicons/react/20/solid";
import { TutoringSelect, SchoolYear, Semester, CourseExtend, Week, Course, Classroom, Teacher } from "./select";
import DatePicker, { Calendar } from "react-multi-date-picker";

const def_create = {
  tutoring_id: "",
  school_year: "",
  semester: "",
  course_no: "",
  course_name_extend: "",
  start_date: "",
  end_date: "",
  number: 0,
  pricing: 0,
  special_price: 0,
  is_active: true
};

export default function Example({ setInfo }) {
  const [createData, setCreateData] = useState(def_create);

  async function addItem() {
    if (createData.tutoring_id == "") {
      setInfo({ show: true, success: false, msg: "請選擇補習班" });
      return;
    }
    if (createData.school_year == "") {
      setInfo({ show: true, success: false, msg: "請選擇學年" });
      return;
    }
    if (createData.semester == "") {
      setInfo({ show: true, success: false, msg: "請選擇學期" });
      return;
    }
    if (createData.course_no == "") {
      setInfo({ show: true, success: false, msg: "請選擇課程" });
      return;
    }
    if (createData.start_date == "") {
      setInfo({ show: true, success: false, msg: "請選擇開課日期" });
      return;
    }
    if (createData.end_date == "") {
      setInfo({ show: true, success: false, msg: "請選擇結業日期" });
      return;
    }
    // if (isSame) {
    //   detail.map((item) => (item.teacher_id_list = detail[0].teacher_id_list));
    // }
    // input.course_time_create_list = detail.filter((i) => i.week?.toString() != "" && i.start_time && i.end_time);

    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(createData)
    };
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/${createData.tutoring_id}/course`, config);
    const res = await response.json();
    if (response.ok) {
      setInfo({
        show: true,
        success: true,
        msg: "新增完成"
      });
      setCreateData(def_create);
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
    <div className="isolate bg-white px-6 py-12 rounded-md">
      <div className="mx-auto text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">新增主課程</h2>
      </div>
      <div className="mx-auto mt-8">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1 row-span-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="col-span-1">
                <label
                  htmlFor="srcName"
                  className="block text-sm font-semibold leading-6 text-red-500"
                >
                  開課日期
                </label>
                <div className="sm:mt-2">
                  <input
                    type="date"
                    value={createData.start_date}
                    onChange={(event) => {
                      setCreateData({
                        ...createData,
                        start_date: event.target.value
                      });
                    }}
                    className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="sm:col-span-1">
                <label
                  htmlFor="srcName"
                  className="block text-sm font-semibold leading-6 text-red-500"
                >
                  結業日期
                </label>
                <div className="sm:mt-2">
                  <input
                    type="date"
                    value={createData.end_date}
                    onChange={(event) => {
                      setCreateData({
                        ...createData,
                        end_date: event.target.value
                      });
                    }}
                    className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="col-span-2 flex justify-center">
                <Calendar
                  value={[createData.start_date, createData.end_date]}
                  onChange={(value) => {
                    if (value[1]) {
                      setCreateData({
                        ...createData,
                        start_date: value[0].format("YYYY-MM-DD"),
                        end_date: value[1].format("YYYY-MM-DD")
                      });
                    }
                  }}
                  range
                  rangeHover
                />
              </div>
            </div>
          </div>
          <div className="col-span-1">
            <TutoringSelect setInput={setCreateData} />
          </div>
          <div className="col-span-1">
            <div className="grid grid-cols-2 gap-2">
              <div className="col-span-1">
                <SchoolYear setInput={setCreateData} />
              </div>
              <div className="col-span-1">
                <Semester setInput={setCreateData} />
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <Course setInput={setCreateData} />
          </div>
          <div className="col-span-1">
            <CourseExtend setInput={setCreateData} />
          </div>
          <div className="mt-10 col-span-2 flex justify-center items-end">
            <button
              type="submit"
              onClick={addItem}
              className="block w-40 rounded-md bg-green-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-500"
            >
              新增
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
