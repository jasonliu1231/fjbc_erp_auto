"use client";

import { useState, useEffect } from "react";
import { ChevronDownIcon, ArrowPathIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";

export default function Example({ error, setInfo }) {
  const [loading, setLoading] = useState(true);
  const [studentState, setStudentState] = useState(0);
  const [tutoring, setTutoring] = useState();
  const [student, setStudents] = useState([]);
  const [query, setQuery] = useState("");
  const [grade, setGrade] = useState(0);
  const [student_click, setStudent_click] = useState("");

  let list = studentState == 1 ? student.filter((i) => i.status.id == 2) : studentState == 2 ? student.filter((i) => i.status.id == 3) : student.filter((i) => i.status.id == 1);
  list = grade === 0 ? list : list.filter((i) => i.grade && i.grade.id == grade);
  const filteredItems =
    query === ""
      ? list
      : list.filter((item) => {
          const name = item.user.first_name.toLowerCase() || "";
          const en_name = item.user.nick_name?.toLowerCase() || "";
          const tel = item.user.tel?.toLowerCase() || "";
          const school = item.school?.school_name?.toLowerCase() || "";
          return name.includes(query.toLowerCase()) || en_name.includes(query.toLowerCase()) || tel.includes(query.toLowerCase()) || school.includes(query.toLowerCase());
        });

  async function getStudentList() {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        clientid: `${localStorage.getItem("client_id")}`,
        "Content-Type": "application/json"
      }
    };
    let url = `${process.env.NEXT_PUBLIC_API_URL_8102}/fjbc_tutoring_api/student/list?`;
    if (tutoring) {
      url += `tutoring_id=${tutoring}`;
    }
    const response = await fetch(url, config);
    const res = await response.json();
    if (response.ok) {
      setStudents(res.list);
    } else {
      const msg = error(response.status, res);
      setInfo({
        show: true,
        success: false,
        msg: "錯誤" + msg
      });
    }
    setLoading(false);
  }

  useEffect(() => {
    setStudent_click(sessionStorage.getItem("student_click"));
  }, []);

  useEffect(() => {
    getStudentList();
  }, [tutoring]);

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-40">
        <div className="spinner"></div>
        <span className="mx-4 text-blue-500">資料讀取中...</span>
      </div>
    );
  }

  const index = sessionStorage.getItem("student_Position");

  window.addEventListener("scroll", () => {
    sessionStorage.setItem("student_Position", window.scrollY);
  });

  if (index) {
    window.scrollTo(0, parseInt(index, 10));
  }

  return (
    <>
      <div className="flex">
        <div className="relative rounded-md shadow-sm">
          <input
            onChange={(event) => setQuery(event.target.value)}
            value={query}
            type="text"
            placeholder="姓名、學校、電話"
            className="p-2 block w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <MagnifyingGlassIcon
              aria-hidden="true"
              className="h-5 w-5 text-gray-400"
            />
          </div>
        </div>
        <div className="grid grid-cols-1">
          <select
            value={grade}
            onChange={(e) => {
              setGrade(e.target.value);
            }}
            className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
          >
            <option value="0">全年級</option>
            <option value="5">小一</option>
            <option value="6">小二</option>
            <option value="7">小三</option>
            <option value="8">小四</option>
            <option value="9">小五</option>
            <option value="10">小六</option>
            <option value="11">國一</option>
            <option value="12">國二</option>
            <option value="13">國三</option>
            <option value="14">高一</option>
            <option value="15">高二</option>
            <option value="16">高三</option>
          </select>
          <ChevronDownIcon
            aria-hidden="true"
            className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
          />
        </div>
        <div>
          <span className="isolate inline-flex rounded-md shadow-sm mx-1">
            <button
              onClick={() => {
                setTutoring(1);
              }}
              type="button"
              className={`${
                tutoring == 1 ? "ring-2 ring-blue-300" : "ring-1 ring-gray-300"
              } ring-inset relative -ml-px inline-flex items-center bg-white rounded-l-md px-3 py-2 text-sm font-semibold text-gray-900  hover:bg-gray-50 focus:z-10`}
            >
              多易
            </button>
            <button
              onClick={() => {
                setTutoring(2);
              }}
              type="button"
              className={`${
                tutoring == 2 ? "ring-2 ring-blue-300" : "ring-1 ring-gray-300"
              } ring-inset relative -ml-px inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900  hover:bg-gray-50 focus:z-10`}
            >
              艾思
            </button>
            <button
              onClick={() => {
                setTutoring(3);
              }}
              type="button"
              className={`${
                tutoring == 3 ? "ring-2 ring-blue-300" : "ring-1 ring-gray-300"
              } ring-inset relative -ml-px inline-flex items-center bg-white rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900  hover:bg-gray-50 focus:z-10`}
            >
              華而敦
            </button>
          </span>
          <span className="isolate inline-flex rounded-md shadow-sm mx-1">
            <button
              onClick={() => {
                setStudentState(0);
              }}
              type="button"
              className={`${
                studentState == 0 ? "ring-2 ring-red-300" : "ring-1 ring-gray-300"
              } ring-inset relative -ml-px inline-flex items-center bg-white rounded-l-md px-3 py-2 text-sm font-semibold text-gray-900  hover:bg-gray-50 focus:z-10`}
            >
              一般生
            </button>
            {/* <button
              onClick={() => {
                setStudentState(1);
              }}
              type="button"
              className={`${
                studentState == 1 ? "ring-2 ring-red-300" : "ring-1 ring-gray-300"
              } ring-inset relative -ml-px inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900  hover:bg-gray-50 focus:z-10`}
            >
              試聽生
            </button> */}
            <button
              onClick={() => {
                setStudentState(2);
              }}
              type="button"
              className={`${
                studentState == 2 ? "ring-2 ring-red-300" : "ring-1 ring-gray-300"
              } ring-inset relative -ml-px inline-flex items-center bg-white rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900  hover:bg-gray-50 focus:z-10`}
            >
              離校生
            </button>
            <button
              onClick={() => {
                setStudentState(0);
                setTutoring();
                setQuery("");
              }}
              type="button"
              className="relative inline-flex rounded-md items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-inset ring-1 ring-gray-300 hover:bg-gray-50 focus:z-10"
            >
              <ArrowPathIcon className="w-5 h-5" />
            </button>
          </span>
        </div>
      </div>
      <div className="h-70vh overflow-auto px-2 mt-1">
        <ul
          role="list"
          className="mx-auto mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-2 gap-y-2"
        >
          {filteredItems.map((person) => (
            <li
              key={person.id}
              className={`${person.id == student_click ? "bg-red-200" : "bg-white"} flex flex-col gap-6 xl:flex-row p-2 cursor-pointer hover:bg-gray-200 rounded-lg`}
              onClick={() => {
                sessionStorage.setItem("student_click", person.id);
                window.location.href = `/admin/student/setting?id=${person.id}`;
              }}
            >
              <div className="flex items-center">
                {person.user.photo ? (
                  <img
                    alt=""
                    src={person.user.photo}
                    className="h-12 w-12"
                  />
                ) : (
                  <span className="inline-block h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                    <svg
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="h-full w-full text-gray-300"
                    >
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </span>
                )}

                <div className="flex-auto ml-3">
                  <h3 className="text-lg font-semibold leading-8 tracking-tight text-gray-900">{person.user.first_name}</h3>
                  <p className={`${person.user.nick_name ? "" : "opacity-0"} text-base leading-7 text-gray-600`}>{person.user.nick_name || "no name"}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
