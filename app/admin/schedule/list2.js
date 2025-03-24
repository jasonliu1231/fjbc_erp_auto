"use client";

import { useEffect, useState } from "react";
import { MagnifyingGlassIcon, CalendarIcon, ArrowPathIcon } from "@heroicons/react/20/solid";
import { TutoringSelect, SchoolYear, Semester } from "./select";
import { error } from "../../utils";

const semester = ["上學期", "下學期", "暑假", "寒假", "其他"];

export default function Example({ setInfo }) {
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState({});
  const [query, setQuery] = useState("");
  const [late, setLate] = useState(false);

  let filterItem = late ? list.filter((i) => new Date(i.end_date) < new Date()) : list.filter((i) => new Date(i.end_date) >= new Date());

  filterItem =
    query === ""
      ? filterItem
      : filterItem.filter((item) => {
          const name = item.course.course_name.toLowerCase() || "";
          return name.includes(query.toLowerCase());
        });

  async function getItemsList() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    let url = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/tutoring/course/list?`;
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

  useEffect(() => {
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
        <div className="col-span-4">
          <TutoringSelect setInput={setSelected} />
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-semibold leading-6 text-gray-700">關鍵字搜尋</label>
          <div className="mt-2 relative rounded-md shadow-sm">
            <input
              onChange={(event) => setQuery(event.target.value)}
              value={query}
              type="text"
              placeholder="課程名稱"
              className="p-2 block w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <MagnifyingGlassIcon
                aria-hidden="true"
                className="h-5 w-5 text-gray-400"
              />
            </div>
          </div>
        </div>
        <div className="col-span-2 flex">
          <button
            onClick={() => {
              setSelected({});
            }}
            type="button"
            className="mx-1 relative inline-flex rounded-md items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-inset ring-1 ring-gray-300 hover:bg-gray-50 focus:z-10"
          >
            <ArrowPathIcon className="w-5 h-5" />
          </button>
          <div>
            <button
              onClick={() => {
                setLate(true);
              }}
              type="button"
              className={`${late ? "bg-red-200" : "bg-white"} relative inline-flex rounded-l-md items-center px-3 py-2 text-sm font-semibold text-gray-900 ring-inset hover:bg-gray-50 focus:z-10`}
            >
              過期
            </button>
            <button
              onClick={() => {
                setLate(false);
              }}
              type="button"
              className={`${!late ? "bg-red-200" : "bg-white"} relative inline-flex rounded-r-md items-center px-3 py-2 text-sm font-semibold text-gray-900 ring-inset hover:bg-gray-50 focus:z-10`}
            >
              線上
            </button>
          </div>
        </div>

        <span className="col-span-4 text-red-500">* 紅色代表無課程時段</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-4 gap-y-3 bg-white shadow-sm ring-1 ring-gray-200 rounded-xl p-4 mt-4">
        {filterItem.map((item, index) => (
          <div
            key={index}
            onClick={() => {
              window.location.href = `/admin/schedule/weekclass?id=${item.id}`;
            }}
            className={`${item.course_time_list.length == 0 ? "border-2 border-red-400" : "border-2 border-gray-300"} col-span-1 cursor-pointer hover:bg-gray-200 rounded-md`}
          >
            <div className="p-1">
              <div className="text-lg">
                <div className="mr-1 text-gray-900">
                  <span className="mr-1 text-sm text-gray-500 flex">
                    <div>{item.school_year}學年</div>
                    <div>{semester[item.semester - 1]}</div>
                  </span>
                  {item.course.course_name}
                  {item.course_name_extend}
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                {/* <CalendarIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                /> */}
                <div className="flex justify-around w-full">
                  <div>{item.start_date}</div>
                  <div>~</div>
                  <div>{item.end_date}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
